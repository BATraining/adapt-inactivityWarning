# adapt-inactivityWarning

The **inactivityWarning** extension notify with a Inactivity Warning feedback after 5 minutes of inactivity with countdown of 60 second, if user makes an action in preview before 60 sec countdown finishes, inactivity warning feedback closes and preview stays open and if user does NOT make an action in the lesson preview before the 60 sec countdown finishes , Inactivity Warning feedback window and the self-paced lesson preview are closed automatically after 60second countdown is complete.

### Attributes

>**_isEnabled** (boolean):  Turns on and off the **inactivityWarning** extension. Can be set in *course.json*to disable **inactivityWarning**
  
>**sessionTime** (number):  This number specifies the duration of the active session time. please add sessionTime in minutues only for example 1,2,3,4,5 min.  

**feedback**(string): feedback is used to notify the user with a Inactivity Warning

## Limitations

 Extention is only allowed to be called for windows that were opened by a script using the window.open() method. If the window was not opened by a script, an error similar to this one appears in the console: Scripts may not close windows that were not opened by script.


