/**
 * Tweetie: A simple Twitter feed plugin
 * Author: Sonny T. <hi@sonnyt.com>, sonnyt.com
 */

(function ($) {
    'use strict';

    $.fn.twittie = function () {
        var options = (arguments[0] instanceof Object) ? arguments[0] : {},
            callback = (typeof arguments[0] === 'function') ? arguments[0] : arguments[1];

        // Default settings
        var settings = $.extend({
            'username': null,
            'list': null,
            'hashtag': null,
            'count': 10,
            'hideReplies': false,
            'dateFormat': '%b/%d/%Y',
            'template': '{{date}} - {{tweet}}',
            'apiPath': 'api/tweet.php',
            'outputMediaOnly': false,
            'mediaCount': false
        }, options);

        if (settings.list && !settings.username) {
            $.error('If you want to fetch tweets from a list, you must define the username of the list owner.');
        }

        /**
         * Applies @reply, #hash and http links
         * @param  {String} tweet A single tweet
         * @return {String}       Fixed tweet
         *
         * Thanks to @Wachem enhanced linking.
         */
        var linking = function (tweet) {
            var twit = tweet.replace(/(https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\/_\.]*(\?\S+)?)?)?)/ig, '<a href="$1" target="_blank" title="Visit this link">$1</a>')
                .replace(/#([a-zA-Z0-9_]+)/g, '<a href="http://twitter.com/search?q=%23$1&amp;src=hash" target="_blank" title="Search for #$1">#$1</a>')
                .replace(/@([a-zA-Z0-9_]+)/g, '<a href="http://twitter.com/$1" target="_blank" title="$1 on Twitter">@$1</a>');

            return twit;
        };

        /**
         * Formating a date
         * @param  {String} twt_date Twitter date
         * @return {String}          Formatted date
         */
        var dating = function (twt_date) {
            // fix for IE
            var time = twt_date.split(' ');
            twt_date = new Date(Date.parse(time[1] + ' ' + time[2] + ', ' + time[5] + ' ' + time[3] + ' UTC'));

            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            var _date = {
                '%d': twt_date.getDate(),
                '%m': twt_date.getMonth() + 1,
                '%b': months[twt_date.getMonth()].substr(0, 3),
                '%B': months[twt_date.getMonth()],
                '%y': String(twt_date.getFullYear()).slice(-2),
                '%Y': twt_date.getFullYear()
            };

            var date = settings.dateFormat;
            var format = settings.dateFormat.match(/%[dmbByY]/g);

            for (var i = 0, len = format.length; i < len; i++) {
                date = date.replace(format[i], _date[format[i]]);
            }

            return date;
        };

        /**
         * Templating a tweet using '{{ }}' braces
         * @param  {Object} data Tweet details are passed
         * @return {String}      Templated string
         */
        var templating = function (data) {
            var temp = settings.template;
            var temp_variables = ['date', 'tweet', 'avatar', 'url', 'retweeted', 'screen_name', 'user_name'];

            for (var i = 0, len = temp_variables.length; i < len; i++) {
                temp = temp.replace(new RegExp('{{' + temp_variables[i] + '}}', 'gi'), data[temp_variables[i]]);
            }

            return temp;
        };

        // Set loading
        this.html('<span>Loading...</span>');

        var that = this;

        // Fetch tweets
        $.getJSON(settings.apiPath, {
            username: settings.username,
            list: settings.list,
            hashtag: settings.hashtag,
            count: settings.count,
            exclude_replies: settings.hideReplies
        }, function (twt) {
            that.find('span').fadeOut('fast', function () {
                that.html('');

                var mediaOutputCount = 0;
                var tCount = (twt.length < settings.count ? twt.length : settings.count);
                for (var i = 0; i < tCount; i++) {
                    var tweet = false;
                    if (twt[i]) {
                        tweet = twt[i];
                    } else if (twt.statuses !== undefined && twt.statuses[i]) {
                        tweet = twt.statuses[i];
                    } else {
                        break;
                    }

                    if (!settings.outputMediaOnly || (settings.outputMediaOnly && tweet.entities.media)) {


                        var tweetContent = null;
                        var title = tweet.text;
                        if (settings.outputMediaOnly) {
                            var mediaCount = tweet.entities.media.length;
                            for (var j = 0; j < mediaCount; j++ ) {
                                var mItem = tweet.entities.media[j];
                                if (mItem.type == 'photo' && (tweet.retweeted != true && undefined == tweet.retweeted_status) ){
                                    tweetContent = '<a title="'+ title+ '" href="' + mItem.media_url + '" rel="prettyPhoto[tweetie]"><img src="' + mItem.media_url + ':thumb" /></a>';
                                    mediaOutputCount++;
                                    break;
                                }
                            }
                        } else {
                            tweetContent = ((tweet.retweeted && tweet.retweeted_status) ? linking('RT @' + tweet.user.screen_name + ': ' + tweet.retweeted_status.text) : linking(tweet.text));
                        }

                        if ( tweetContent != null ) {
                            var temp_data = {
                                user_name: tweet.user.name,
                                date: dating(tweet.created_at),
                                tweet: tweetContent,
                                avatar: '<img src="' + tweet.user.profile_image_url + '" />',
                                url: 'http://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str,
                                retweeted: tweet.retweeted,
                                screen_name: linking('@' + tweet.user.screen_name)
                            };

                            that.append(templating(temp_data));
                            if (settings.outputMediaOnly && settings.mediaCount !== false && mediaOutputCount >= settings.mediaCount) {
                                break;
                            }
                        }
                    }
                }

                if (typeof callback === 'function') {
                    callback();
                }
            });
        });
    };

})(jQuery);
