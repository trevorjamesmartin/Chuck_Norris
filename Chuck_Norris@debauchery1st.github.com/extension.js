const St = imports.gi.St;
const Main = imports.ui.main;
//const Soup = imports.gi.Soup;  TODO: make soup, not tsunamis
const Lang = imports.lang;
const GLib = imports.gi.GLib;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
//const ICON = 'norris';
const ICON = 'norris-dark';

/*
 This extension was round-house-kicked out of my brain by Chuck Norris

  Trevor Martin
  trevor.j.martin@gmail.com

 many thanks to the author of the icndb api.

*/

const ICNDB_RANDOM = "http://api.icndb.com/jokes/random";

const RoundHouseKick_Indicator = new Lang.Class({
    Name: 'RoundHouseKick.indicator',
    Extends: PanelMenu.Button,

       _init: function(){
           this.parent(0.0);
           this.icon = new St.Icon({icon_name: ICON, style_class: 'system-status-icon'});
           this.actor.add_child(this.icon);

           let label = new St.Label({text: 'iCNdb'});
           this.actor.add_child(label);

           let menuItem = new PopupMenu.PopupMenuItem('!');
           menuItem.actor.connect('button-press-event', function(){
               Main.notify('Did you know?', chuck_foo())
           });

           this.menu.addMenuItem(menuItem);

       }
 });


function init(extensionMeta) {
    let theme = imports.gi.Gtk.IconTheme.get_default();
    theme.append_search_path(extensionMeta.path + "/icons");
    log ('Chuck Norris initalized');
};

function enable() {
     log ('Chuck Norris enabled');

     let _indicator =  new RoundHouseKick_Indicator();
     Main.panel._addToPanelBox('RoundHouseKick', _indicator, 1, Main.panel._rightBox);
};

function disable(){
     log ('Chuck Norris disabled');

     _indicator.destroy();
};


function set_text(item, text) {
    item.actor.visible = Boolean(text);
    item.label.set_text(text);
}

function chuck_foo() {
    return JSON.parse(GLib.spawn_command_line_sync('curl '+ICNDB_RANDOM)[1].toString())['value']['joke'].replace(/&quot;/g, '\"');
};


// https://stackoverflow.com/questions/14484787/wrap-text-in-javascript
function wordWrap(str, maxWidth) {
    var newLineStr = "\n"; done = false; res = '';
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
    var white = new RegExp(/^\s$/);
    return white.test(x.charAt(0));
};
