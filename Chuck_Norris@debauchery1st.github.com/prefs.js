const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const _ = imports.gettext.domain(Me.uuid).gettext;

const SETTINGS_NERDY_CONTENT = 'nerdy-content';
const SETTINGS_EXPLICIT_CONTENT = 'explicit-content';

const LICENSE_BRIEF = '\nChuck Norris GNOME shell extension\n\n' +
    'version '+ Me.version + '\n\n' +
    'jokes from <a href="http://www.icndb.com/">The Internet Chuck Norris Database</a>\n\n' +
    'this program comes with ABSOLUTELY NO WARRANTY.\n' +
    'This is free software, and you are welcome to redistribute it\n' +
    '<a href="https://www.gnu.org/licenses/old-licenses/gpl-2.0.html">See the ' +
    'GNU General Public License, version 2 or later for details</a>';

let settings;

function init() {
    const GioSSS = Gio.SettingsSchemaSource;
    let schemaSource = GioSSS.new_from_directory(Me.path, GioSSS.get_default(), false);
    let schemaObj = schemaSource.lookup(Me.metadata["settings-schema"], true);
    if (!schemaObj) {
        throw new Error ("Schema " + Me.metadata["settings-schema"] + " could not be found for extension " +
                            Me.uuid + ". Please check your installation.");
    }
    settings = new Gio.Settings({settings_schema: schemaObj});
}

function buildPrefsWidget() {
    this._image = new Gtk.Image({
        file: Me.path + "/icons/old/norris-lite.svg"
    });
    this._license = new Gtk.Label({
        xalign: true, label: ""});
    this._license.set_markup(LICENSE_BRIEF);
    this._nerdy_label = new Gtk.Label({
        xalign: 1, label: _("Nerdy:")});
    this._nerdy_switch = new Gtk.Switch({
        hexpand: false,
        active: settings.get_boolean(SETTINGS_NERDY_CONTENT)});

    this._nerdy_switch.connect("notify::active", function (button) {
        settings.set_boolean(SETTINGS_NERDY_CONTENT, button.active);
    });
    this._nerdy_switch.set_tooltip_text(_("Nerdy Jokes"));

    this._nsfw_label = new Gtk.Label({
        xalign: 1, label: _("Explicit Content:")});
    this._nsfw_switch = new Gtk.Switch({
        hexpand: false,
        active: settings.get_boolean(SETTINGS_EXPLICIT_CONTENT)});

    this._nsfw_switch.connect("notify::active", function (button) {
        settings.set_boolean(SETTINGS_EXPLICIT_CONTENT, button.active);
    });
    this._nsfw_switch.set_tooltip_text(_("WARNING! N.S.F.W."));

    this._grid = new Gtk.Grid({
        column_spacing: 25,
        halign: Gtk.Align.CENTER,
        margin: 10, row_spacing: 10 });
    this._grid.set_border_width(15);
    this._grid.attach(this._nerdy_label, 1, 1, 1, 1);
    this._grid.attach(this._nerdy_switch, 2, 1, 1, 1);
    this._grid.attach(this._nsfw_label, 1, 2, 1, 1);
    this._grid.attach(this._nsfw_switch, 2, 2, 1, 1);
    this._grid.attach(this._image, 1, 3, 1, 1)
    this._grid.attach(this._license, 1, 4, 1, 1);
    this._grid.show_all();
    return this._grid;
}

