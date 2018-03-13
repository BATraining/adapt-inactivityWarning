define(["coreJS/adapt"], function(Adapt) {

    var inactivityWarning = Backbone.View.extend({

        initialize: function(model) {
              this.validateInActiveTime(model);
              countDown = undefined;
              this.bindMouseEvents();
              this.bindKeyboardEvents();
        },

        bindMouseEvents: function() {
           var self = this;
          if(Adapt.device.touch) {
              $('.popup-button, .notify-shadow').on('click touchstart',function() {
                      console.log("touch");
                      self.resetTimers();
              });
          }

            $(document).on('click',function(event) {
                if(event.target.className == "notify-popup-body Inactive" || event.target.className == "notify-popup-content-inner" || event.target.className == "notify-popup-content" || event.target.className == "notify-popup-inner" || event.target.className == "notify-popup-body-inner" || event.target.className == "notify-popup-title" || event.target.className == "notify-popup notify-type-popup") return;
                     self.resetTimers()
            });

            $('#wrapper').on('touchstart',function(event) {
                if(event.target.className == "notify-popup-body Inactive" || event.target.className == "notify-popup-content-inner" || event.target.className == "notify-popup-content" || event.target.className == "notify-popup-inner" || event.target.className == "notify-popup-body-inner" || event.target.className == "notify-popup-title" || event.target.className == "notify-popup notify-type-popup") return;
                    self.resetTimers()
            });

            $('iframe').contents().find("body").on('click', function(event) {
                     clearInterval(time);
                     self.validateInActiveTime();
            });
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
          var self = this;
            $(document).keypress(function(event) {
                  self.resetTimers();
            });
        },

        remove: function() {
             $(document).off('click');
             $('#wrapper').off('touchstart');
             $('iframe').contents().find("body").off('click')
             $(document).off('keypress');
        },

        hidePopup: function() {
            if($('.notify-popup-body').hasClass('Inactive')) {
                  this.resetPopup();
            }
            this.remove();
        },

        validateInActiveTime: function() {
            var inActivityWarning = this.model.get("_inactivityWarning");
            var getSessionTime = inActivityWarning.sessionTime;
            var convertedInSec = getSessionTime*60;
            time = setInterval(function(){ Timer() }, 1000)

            var self = this;
            function Timer() {
               if (convertedInSec <=0)  return;
                    convertedInSec = convertedInSec-1;
                    console.log("inactiveFrom",convertedInSec);
                   if (convertedInSec === 0) {
                        clearInterval(time)
                        if($('.notify-popup-body').length) {
                          self.resetPopup();
                        }
                        self.startCountDown();
                        var popupObject = {
                                title: "INACTIVITY WARNING",
                                body :  inActivityWarning.feedback
                        };
                        Adapt.trigger('notify:popup', popupObject);
                        $('.notify-popup-body').addClass('Inactive').css('text-align','center');
                        $(".notify-popup-done").addClass("display-none");
                   }
                   self.bindMouseEvents();
            }
        },

        startCountDown: function() {
             var sec= 60;
             countDown = setInterval(function(){ count() }, 1000);
             var self = this;
                    function count() {
                        if (sec <=0)  return;
                            sec = sec-1;
                            if (sec <= 0) {
                                  clearInterval(countDown);
                                  self.hidePopup();
                                  self.closeCourse();
                            }
                                this.$('.notify-popup-title').html('INACTIVITY WARNING');
                                this.$('.second').html(sec);
                    }
        },

        resetPopup: function() {
              $('.notify-popup').remove();
              $('body').scrollEnable();
              $('.notify-shadow').css('display','none');
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

    Adapt.on('app:dataReady',function() {
         var config = Adapt.course.get("_inactivityWarning");
         if(!config || !config._isEnabled) return;
            initialise(Adapt.course);
    });

});
