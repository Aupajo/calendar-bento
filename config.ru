require 'almanack/server'
require 'active_support/core_ext/time'
require 'active_support/core_ext/date'
require 'active_support/core_ext/date_time'
require 'active_support/core_ext/numeric/time'
require 'yaml'

meetup_api_key = ENV['MEETUP_API_KEY']

begin
  meetup_api_key ||= YAML.load_file('config.yml')['meetup_api_key']
rescue Errno::ENOENT
  abort "Did you create config.yml? See the README."
end

Almanack.config do |c|
  c.title = "Event Calendar"
  c.theme = 'bento'

  # Caching (empty the `tmp` directory to clear the cache)
  c.cache_responses = true
  c.cache_expiry = 900 # seconds

  groups = %w(
    WellingtonPhotographyMeetupGroup
    WelliDotNet
    designpro
    Wellington-Adobe-Web-Technology-Meetup
    Wlg-AUG
    Wellington-Cloud-Computing-User-Group
    kiwi-code-retreat
    EdTech-Wellington-Meetup
    ember-js-wellington
    Enspiral-Dev-Academy-Meetup
    Dev-Meet-Ups
    Game-Developers-of-Wellington
    hackpack
    Hackers-and-Founders-Wellington
    NetSquared-Wellington
    Node-js-Wellington
    Open-Coffee-Club-Meetup
    New-Zealand-OpenStack-User-Group
    OWASP-New-Zealand-Chapter-Wellington
    PHP-Usergroup-Wellington
    playing-with-code-wellington
    PyLadies-Wellington
    NZPUG-Wellington
    SilverStripe-Wellington-Meetup-Group
    StartupGarage
    Test-Professionals-Network-Wellington
    Wellington-Drupal-Meetup
    Wellington-Functional-Programming-Meetup
    WellingtonJS
    wellingtonmakerspace
  )

  groups.each do |group|
    c.add_meetup_group group_urlname: group, key: meetup_api_key
  end
end

run Almanack::Server
