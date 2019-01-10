/*

    Chuck Norris gnome-shell-extension pulls information from ICNDB.com
    Copyright (C) 2019  Trevor James Martin

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

*/

/*
 This extension was round-house-kicked out of my brain by Chuck Norris

  Trevor James Martin
  trevor.j.martin@gmail.com

 many thanks to the author of the icndb api, {your name and info go here}

 */

const Lang = imports.lang;
const St = imports.gi.St;
const Main = imports.ui.main;
const Soup = imports.gi.Soup;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const ICON = 'norris-dark';
const BASE_URL = "http://api.icndb.com/jokes/random?";

let httpSession = new Soup.SessionAsync();
Soup.Session.prototype.add_feature.call(httpSession, new Soup.ProxyResolverDefault());

let _icon;
let _menuItem2;

const SETTINGS_NERDY_CONTENT = 'nerdy-content';
const SETTINGS_EXPLICIT_CONTENT = 'explicit-content';

let settings;

const Gio = imports.gi.Gio;
const Me = imports.misc.extensionUtils.getCurrentExtension();

function loadSettings() {
    const GioSSS = Gio.SettingsSchemaSource;
    let schemaSource = GioSSS.new_from_directory(Me.path, GioSSS.get_default(), false);
    let schemaObj = schemaSource.lookup(Me.metadata["settings-schema"], true);
    if (!schemaObj) {
        throw new Error ("Schema " + Me.metadata["settings-schema"] + " could not be found for extension " +
                            Me.uuid + ". Please check your installation.");
    }
    settings = new Gio.Settings({settings_schema: schemaObj});
}

const RoundHouseKick_Indicator = new Lang.Class({
    Name: 'RoundHouseKick.Indicator',
    Extends: PanelMenu.Button,

    _init: function () {
        this.parent(0.0);

        _menuItem2 = new PopupMenu.PopupMenuItem('');

        this.joke_being_delivered = false;

        _icon = new St.Icon({
            icon_name: ICON,
            style_class: 'system-status-icon'
        });

        this.actor.add_child(_icon);

        let menuItem = new PopupMenu.PopupMenuItem('!');

        menuItem.actor.connect('button-press-event', function () {
            if (this.joke_being_delivered) {
                log('still waiting for the joke...');
                return;
            }

            this.joke_being_delivered = true;

            let _nerdy = settings.get_boolean(SETTINGS_NERDY_CONTENT);
            let _nsfw = settings.get_boolean(SETTINGS_EXPLICIT_CONTENT);

            let _excluded = [];
            let _args = "";

            if (!_nsfw) {
                log('excluding NSFW content');
                _excluded.push("explicit")
            }

            if (!_nerdy) {
                log('excluding nerdy jokes');
                _excluded.push("nerdy")
            }

            if (_excluded.length > 0) {
                log('building URL');
                _args = "exclude=" + _excluded.toString();
            }

            let JOKE_URL = BASE_URL + _args;
            log("REQUESTING "+ JOKE_URL);
            set_text(_menuItem2, 'refreshing...');

            let request = Soup.Message.new('GET', JOKE_URL);
            httpSession.queue_message(request, Lang.bind(this, function (httpSession, message) {
                if (message.status_code === 200) {
                    let value = JSON.parse(message.response_body.data)['value'];
                    let joke_raw = value['joke'].replace(/&quot;/g, '\"');
                    let joke_wrapped = wordWrap(joke_raw, 60);
                    set_text(_menuItem2, joke_wrapped);
                    this.joke_being_delivered = false;
                }
            }));
        });

        this.menu.addMenuItem(menuItem);
        this.menu.addMenuItem(_menuItem2);
    },

});

let rhk_indicator;

function init(extensionMeta) {
    let theme = imports.gi.Gtk.IconTheme.get_default();
    theme.append_search_path(extensionMeta.path + "/icons");
    log('"I don\'t initiate violence, I retaliate." - Chuck Norris');
    loadSettings();
}

function enable() {
    log('Chuck Norris round-house kicks his way to the Gnome Desktop');
    rhk_indicator = new RoundHouseKick_Indicator();
    Main.panel._addToPanelBox('RoundHouseKick', rhk_indicator, 1, Main.panel._rightBox);
}

function disable() {
    log('"Good morals lead to good laws." - Chuck Norris');
    rhk_indicator.destroy();
}

function set_text(item, text) {
    item.actor.visible = true;
    item.label.set_text(text);
}

function wordWrap(str, maxWidth) {
    let i;
    let found;
    let newLineStr = "\n";
    let done = false;
    let res = '';
    do {
        found = false;
        // Inserts new line at first whitespace of the line
        for (i = maxWidth - 1; i >= 0; i--) {
            if (testWhite(str.charAt(i))) {
                res = res + [str.slice(0, i), newLineStr].join('');
                str = str.slice(i + 1);
                found = true;
                break;
            }
        }
        // Inserts new line at maxWidth position, the word is too long to wrap
        if (!found) {
            res += [str.slice(0, maxWidth), newLineStr].join('');
            str = str.slice(maxWidth);
        }

        if (str.length < maxWidth)
            done = true;
    } while (!done);

    return res + str;
}

function testWhite(x) {
    let white = new RegExp(/^\s$/);
    return white.test(x.charAt(0));
}
