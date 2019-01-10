const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const _ = imports.gettext.domain(Me.uuid).gettext;

const SETTINGS_NERDY_CONTENT = 'nerdy-content';
const SETTINGS_EXPLICIT_CONTENT = 'explicit-content';

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
    let nerdyLabel = new Gtk.Label({
        xalign: 1, label: _("Nerdy:")});
    let nerdySwitch = new Gtk.Switch({
        hexpand: false,
        active: settings.get_boolean(SETTINGS_NERDY_CONTENT)});

    nerdySwitch.connect("notify::active", function (button) {
        settings.set_boolean(SETTINGS_NERDY_CONTENT, button.active);
    });
    nerdySwitch.set_tooltip_text(_("Nerdy Jokes"));

    let nsfwLabel = new Gtk.Label({
        xalign: 1, label: _("Explicit Content:")});
    let nsfwSwitch = new Gtk.Switch({
        hexpand: false,
        active: settings.get_boolean(SETTINGS_EXPLICIT_CONTENT)});

    nsfwSwitch.connect("notify::active", function (button) {
        settings.set_boolean(SETTINGS_EXPLICIT_CONTENT, button.active);
    });
    nsfwSwitch.set_tooltip_text(_("WARNING! N.S.F.W."));

    let grid = new Gtk.Grid({column_spacing: 25, halign: Gtk.Align.CENTER, margin: 10, row_spacing: 10 });
    grid.set_border_width(15);
    grid.attach(nerdyLabel, 0, 1, 1, 1);
    grid.attach(nerdySwitch, 1, 1, 1, 1);
    grid.attach(nsfwLabel, 2, 1, 1, 1);
    grid.attach(nsfwSwitch, 3, 1, 1, 1);
    grid.show_all();
    return grid;
}