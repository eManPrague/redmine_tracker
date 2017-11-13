<p align="center">
    <img src="https://raw.githubusercontent.com/eManPrague/redmine_tracker/master/readme/background.png" alt="Tracker Icon" align="center" />
</p>

[![Build Status](https://travis-ci.org/eManPrague/redmine_tracker.svg?branch=master)](https://travis-ci.org/eManPrague/redmine_tracker) [![Build status](https://ci.appveyor.com/api/projects/status/9ilogepvjtcvbxco?svg=true)](https://ci.appveyor.com/project/eManPrague/redmine-tracker)

<p align="center">
    <img src="https://raw.githubusercontent.com/eManPrague/redmine_tracker/master/readme/screenshots.png" alt="Tracker Icon" align="center" />
</p>

## Installation 1.0.0 Release Candidate

Go to [releases page](https://github.com/eManPrague/redmine_tracker/releases) and select a version according to your operating system. After the installation fills in your Redmine server and API token, you can find your API token on `My account` page.

### Requirements for Linux

For Linux it is necessary to install `libsecret` library. This library is used in order to store settings safely.

```
sudo apt-get install libsecret-1-dev
```

### Requirements for Redmine

Also, you need to perform some modifications in Redmine, it's necessary to add those lines before the last `end` and of course to restart your instance.

```ruby
# app/views/projects/show.api.rsb
api.array :time_entry_activities do
  @project.activities.each do |activity|
    api.time_entry_activity(:id => activity.id, :name => activity.name)
  end
end if include_in_api_response?('time_entry_activities')

```

## Submitting an Issue

* We use the [GitHub issue tracker](https://github.com/eManPrague/redmine_tracker/issues) to track bugs and features.
* Before submitting a bug report or feature request, check to make sure if it has not already been submitted.
* When submitting a bug report, please include information about Redmine version and operating system.
* **For developers**: Ideally, a bug report should include a pull request with failing specs. :+1:

## Submitting a Pull Request

* Fork the official repository.
* Create a topic branch.
* Implement your feature or bug fix.
* Add, commit, and push your changes.
* Submit a pull request.

## License

MIT
