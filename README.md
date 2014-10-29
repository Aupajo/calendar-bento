# Calendar Bento

A work-in-progress implementation of [the calendar](http://66.228.50.131/calendar) mentioned by [@davekeyes](https://twitter.com/davekeyes/status/491815226119966720) on Twitter, and built using [Almanack](https://github.com/Aupajo/almanack).

![Calendar screenshot](https://i.imgur.com/yDeGHym.png)

## Setting up

With [Ruby 2.0 or greater](https://www.ruby-lang.org/en/installation/) installed (check by running `ruby --version`), run the following inside the `calendar-bento` directory:

    gem install bundler
    bundle install

This will fetch any dependencies needed. Next, create a file called `config.yml` with the following:

```yaml
meetup_api_key: ...
```

You can retrieve your API key [from Meetup.com](https://secure.meetup.com/meetup_api/key).

Finally, run the following inside the `calendar-bento` directory to start a local server:

    almanack start

By default, the server will start on http://localhost:9292/

Press CTRL-C to quit.
