# Sweetp Dashboard

Chrome app for sweetp.

## Install

*   open chrome
*   go to extension managment
*   enable debug mode
*   click on "load unpacked extension"
*   select the `app` folder

## Dev

*   make sure SASS files ar compiled into css with
    *   `grunt compass` or
    *   `grunt server` or
    *   `grunt watch`
*   run tests → see 'karma' tasks of gruntfile

# TODO

* generall
    * add CSS class for templates like 'home', 'settings', ...
    * add settings page to set sweetp server port
* overview
    * put jumbotron and nav into own layout and set it for projects overview
      and settings page
    * get active nav item from hash
    * list optional project properties dynamically
    * get projects of service and read it from file system
