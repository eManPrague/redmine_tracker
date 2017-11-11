<p align="center">
	<img src="https://raw.githubusercontent.com/Strnadj/redmine_tracker/master/readme/background.png" alt="Tracker Icon" align="center" />
</p>

## Installation 1.0.1 release candidate

Go to [releases page](https://github.com/Strnadj/redmine_tracker/releases) and select version according to your operation system.

### Requirements for Linux

For Linux is necessary to install `libsecret` library. This library is used to store settings safely.

```
sudo apt-get install libsecret-1-dev
```

### Requirements for Redmine

Also you have to do some modifications in Redmine, it's necessary to add those lines before last `end` and offcourse restart your instance.

```ruby
# app/views/projects/show.api.rsb

api.array :time_entry_activities do
  @project.activities.each do |activity|
    api.time_entry_activity(:id => activity.id, :name => activity.name)
  end
end if include_in_api_response?('time_entry_activities')

```

## Submitting an Issue

* We use the [GitHub issue tracker](https://github.com/Strnadj/redmine_tracker/issues) to track bugs and features.
* Before submitting a bug report or feature request, check to make sure it hasn't already been submitted.
* When submitting a bug report, please include a informations about Redmine version and operating system.
* **For developers**: Ideally, a bug report should include a pull request with failing specs. :+1:


## Submitting a Pull Request

* Fork the official repository.
* Create a topic branch.
* Implement your feature or bug fix.
* Add, commit, and push your changes.
* Submit a pull request.

## License

MIT