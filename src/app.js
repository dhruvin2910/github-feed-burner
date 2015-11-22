(function () {
  "use strict";

  // todo: Use deferred or promise to handle request queue.

  window.app = {

    // Properties
    userName: '',
    userData: {},
    followersData: [],
    followingData: [],
    followersFeeds: [],
    followingFeeds: [],
    get status() {
      return this.statusElement.val();
    },
    set status(value) {
      this.statusElement.val(value);
    },
    userFeeds: [],
    get rateLimit() {
      return this.rateLimitElement.html();
    },
    set rateLimit(value) {
      var resetDate;
      if (value.rate.remaining) {
        this.rateLimitElement.html(value.rate.remaining);
      } else {
        resetDate = new Date(value.rate.reset * 1000);
        this.status = 'Rate Limit';
        this.rateLimitElement.html(resetDate.getHours() + ':' + resetDate.getMinutes());
        this.userNameElement.attr('disabled', true);
        this.submitElement.attr('disabled', true);
      }
    },

    // Elements
    userNameElement: $('#username'),
    followersBadgeElement: $('#followersBadge'),
    followingBadgeElement: $('#followingBadge'),
    followersPaneElement: $('#followersPane'),
    followingPaneElement: $('#followingPane'),
    statusElement: $('#status'),
    submitElement: $('#submit'),
    userPaneElement: $('#userPane'),
    userBadgeElement: $('#userBadge'),
    rateLimitElement: $('#rateLimit'),
    userTabElement: $('#userTab'),
    resetElement: $('#reset'),

    // Methods
    updateUserName: function (newUserName) {
      if (newUserName && this.userName != newUserName) {
        this.userName = newUserName;
        this.userNameElement.val(this.userName);
        if(appLocalStorage) appLocalStorage.userName = newUserName;
        this.status = 'Loading...';
        setTimeout(this.getUserData.bind(this), 100);
      }
    },

    getUserData: function () {
      this.userData = $.ajax({
        type: 'GET',
        url: app.urls.user,
        async: false
      }).responseJSON;

      if (!this.userData.message) {
        this.getUserFeeds();
        this.populateFollowers();
        this.getFollowersFeeds();
        this.populateFollowing();
        this.getFollowingFeeds();
        this.updateUI();
      } else {
        alert(this.userData.message);
        this.userData = {};
        this.userNameElement.val('');
        this.updateUI();
      }
    },

    updateUI: function () {
      this.userNameElement.val(this.userName);
      this.followersBadgeElement.html(this.userData.followers);
      this.followingBadgeElement.html(this.userData.following);
      this.userBadgeElement.html(this.userData.login ? this.userFeeds.length : undefined);

      // Update user
      this.userPaneElement.html('');
      if (this.userFeeds.length) {
        app.userPaneElement.append(app.templates.feeds({
          user: app.userData,
          feeds: app.userFeeds
        }));
      }

      // Update followers
      this.followersPaneElement.html('');
      this.followersFeeds.forEach(function (listOfFeeds, index) {
        app.followersPaneElement.append(app.templates.feeds({
          user: app.followersData[index],
          feeds: listOfFeeds
        }));
      });

      // Update following
      this.followingPaneElement.html('');
      this.followingFeeds.forEach(function (listOfFeeds, index) {
        app.followingPaneElement.append(app.templates.feeds({
          user: app.followingData[index],
          feeds: listOfFeeds
        }));
      });

      // Update rateLimit
      this.rateLimit = this.getRateLimit();

      // Set my feeds pane
      this.userTabElement.tab('show');

      // Update status
      this.status = 'Ready';

    },

    populateFollowers: function () {
      this.followersData = $.ajax({
        type: 'GET',
        url: app.urls.followers,
        async: false
      }).responseJSON;
    },

    populateFollowing: function () {
      this.followingData = $.ajax({
        type: 'GET',
        url: app.urls.following,
        async: false
      }).responseJSON;
    },

    getFollowersFeeds: function () {
      this.followersFeeds = [];
      this.followersData.forEach(function (follower) {
        app.followersFeeds.push($.ajax({
          type: 'GET',
          url: app.urls.feeds(follower.login),
          async: false
        }).responseJSON);
      });
    },

    getFollowingFeeds: function () {
      this.followingFeeds = [];
      this.followingData.forEach(function (following) {
        app.followingFeeds.push($.ajax({
          type: 'GET',
          url: app.urls.feeds(following.login),
          async: false
        }).responseJSON);
      });
    },

    generateFeeds: function (user) {
      return $(
        app.templates.feeds(user)
      );
    },

    getUserFeeds: function () {
      app.userFeeds = $.ajax({
        type: 'GET',
        url: app.urls.feeds(app.userData.login),
        async: false
      }).responseJSON;
    },

    getRateLimit: function () {
      return $.ajax({
        type: 'GET',
        url: app.urls.rateLimit,
        async: false
      }).responseJSON;
    },

    // URLs
    urls: {
      get user() {
        return 'https://api.github.com/users/' + app.userName;
      },

      get followers() {
        return app.urls.user + '/followers';
      },

      get following() {
        return app.urls.user + '/following';
      },

      feeds: function (user) {
        return 'https://api.github.com/users/' + user + '/events/public';
      },

      get rateLimit() {
        return 'https://api.github.com/rate_limit';
      }
    },

    //  Templates
    templates: {
      feeds: Handlebars.compile($.ajax({
        type: 'GET',
        url: 'feeds.handlebars',
        async: false
      }).responseText)
    }

  };

  // Configure Handlebars helpers
  Handlebars.registerHelper('eventTrimmed', function (type) {
    return type.replace(/Event/, '');
  });

  Handlebars.registerHelper('formattedDateTime', function (dateTime) {
    return dateTime.substr(11, 5) + ' ' + dateTime.substr(8, 2) + '-' + dateTime.substr(5, 2) + '-' + dateTime.substr(2, 2);
  });

  Handlebars.registerHelper('onlyRepo', function (repoName) {
    if (!repoName) return '';
    return repoName.substr(repoName.indexOf('/') + 1);
  });

  Handlebars.registerHelper('onlyBranch', function (refName) {
    if (!refName) return '';
    return refName.substr(refName.lastIndexOf('/') + 1);
  });

  // Initialize
  app.submitElement.click(function () {
    app.updateUserName(app.userNameElement.val());
  });
  app.resetElement.click(function () {
    appLocalStorage.clear();
    location.reload();
  });
  app.rateLimit = app.getRateLimit();

  if(appLocalStorage) {
    app.updateUserName(appLocalStorage.userName);
  }
  app.status = app.status || 'Ready';

})();