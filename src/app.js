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

    // Elements
    userNameElement: $('#username'),
    followersBadgeElement: $('#followersBadge'),
    followingBadgeElement: $('#followingBadge'),
    followersPaneElement: $('#followersPane'),
    followingPaneElement: $('#followingPane'),
    statusElement: $('#status'),
    submitElement: $('#submit'),

    // Methods
    updateUserName: function (newUserName) {
      if(newUserName && this.userName != newUserName){
        this.userName = newUserName;
        this.status = 'Loading...';
        setTimeout(this.getUserData.bind(this), 100);
      }
    },

    getUserData: function () {

      var errorHandler;
      this.userData = $.ajax({
        type: 'GET',
        url: app.urls.user,
        async: false
      }).responseJSON;

      if(!this.userData.message) {
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
        return 'https://api.github.com/users/' + user + '/events/public'
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
    return repoName.substr(repoName.indexOf('/') + 1);
  });

  // Initialize
  app.submitElement.click(function () {
    app.updateUserName(app.userNameElement.val());
  });
  app.status = 'Ready';

})();