define(["coreJS/adapt"], function(Adapt) {

    var inactivityWarning = Backbone.View.extend({

        initialize: function(model) {
            this.validateInActiveTime(model);
            countDown = undefined;
            this.bindMouseEvents();
            this.bindKeyboardEvents();
        },

        bindMouseEvents: function() {
            if (Adapt.device.touch) {
                $('.popup-button, .notify-shadow').on('click touchstart', function() {
                    this.resetTimers();
                }.bind(this));
            }

            $(document).on('click', function(event) {
                if (!checkClass(event.target.className))
                    this.resetTimers()

            }.bind(this));

            var classNames = ['notify-popup-body Inactive',
                'notify-popup-content-inner',
                'notify-popup-content',
                'notify-popup-inner',
                'notify-popup-body-inner',
                'notify-popup-title',
                'notify-popup-title-inner h5',
                'notify-popup notify-type-popup'
            ];

            function checkClass(className) {
                return classNames.includes(className);
            }

            $('#wrapper').on('touchstart', function(event) {
                if (!checkClass(event.target.className))
                    this.resetTimers()

            }.bind(this));

            $('iframe').contents().find("body").on('click', function(event) {
                clearInterval(time);
                this.validateInActiveTime();
            }.bind(this));

            $('#wrapper, .notify').on('mousemove',function(event) {
                    this.resetTimers();
            }.bind(this));
        },

        resetTimers: function() {

            clearInterval(time);
            time = undefined;
            if (countDown) {
                clearInterval(countDown);
                countDown = undefined;
                this.hidePopup();
            }
            this.validateInActiveTime();
        },

        bindKeyboardEvents: function() {
            $(document).keydown(function(event) {
                this.resetTimers();
            }.bind(this));
        },

        remove: function() {
            $(document).off('click');
            $('#wrapper').off('touchstart');
            $('iframe').contents().find("body").off('click')
            $(document).off('keypress');
            $('#wrapper, .notify').off('mousemove')
        },

        hidePopup: function() {
            if ($('.notify-popup-body').hasClass('Inactive')) {
                this.resetPopup();
            }
            this.remove();
        },

        validateInActiveTime: function() {
            var inActivityWarning = this.model.get("_inactivityWarning");
            var getSessionTime = inActivityWarning.sessionTime;
            var convertedInSec = getSessionTime * 60;
            time = setInterval(Timer.bind(this), 1000);

            function Timer() {
                if (convertedInSec <= 0) return;
                convertedInSec = convertedInSec - 1;
                console.log("convertedInSec",convertedInSec);
                if (convertedInSec === 0) {
                    clearInterval(time)
                    if ($('.notify-popup-body').length) {
                        this.resetPopup();
                    }
                    this.startCountDown();
                    var popupObject = {
                        title: "INACTIVITY WARNING",
                        body: inActivityWarning.feedback
                    };
                    Adapt.trigger('notify:popup', popupObject);
                    $('.notify-popup-body').addClass('Inactive');
                    $(".notify-popup-done").addClass("display-none");
                }
                this.bindMouseEvents();
            }
        },

        startCountDown: function() {
            var sec = 60;
            countDown = setInterval(count.bind(this), 1000);

            function count() {
                if (sec <= 0) return;
                sec = sec - 1;
                if (sec <= 0) {
                    clearInterval(countDown);
                    this.hidePopup();
                    this.closeCourse();
                }
                $('.second').html(sec);
            }
        },

        resetPopup: function() {
            $('.notify-popup').remove();
            $('body').scrollEnable();
            $('.notify-shadow').css('display', 'none');
            $('html').removeClass('notify');
        },

        closeCourse: function() {
            var win = top.window || window;
            win.close();
        }

    });

    function initialise(model) {
        new inactivityWarning({
            model: model
        });
    }

    Adapt.on('app:dataReady', function() {
        var config = Adapt.course.get("_inactivityWarning");
        if (!config || !config._isEnabled) return;
        initialise(Adapt.course);
    });

});
