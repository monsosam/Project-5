// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(document).ready(function () {

  var workHours = ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM'];
  var container = $('.container-fluid');

  workHours.forEach(function(hour, index) {
    var timeBlock = $('<div>').addClass('row time-block').attr('id', 'hour-' + (9 + index));
    var hourCol = $('<div>').addClass('col-md-1 hour').text(hour);
    var descCol = $('<textarea>').addClass('col-md-10 description');
    var saveBtn = $('<button>').addClass('btn saveBtn col-md-1').html('<i class="fas fa-save"></i>');

    // Append columns to time block
    timeBlock.append(hourCol, descCol, saveBtn);

    // Append time block to container
    container.append(timeBlock);
  });

  // Display the current date
  $('#currentDay').html(dayjs().format('MMMM D, YYYY') + '<br>' + dayjs().format('dddd'));

  
  // Save button event listener
  $(".saveBtn").on("click", function () {
    var hourId = $(this).closest('.time-block').attr("id");
    var eventDescription  = $(this).siblings(".description").val();
    
    // Attempt to save text in local storage
    try {
      localStorage.setItem(hourId, eventDescription);
      // Show success message
      showFeedback("Event saved successfully.", "success", $(this));
    } catch (error) {
      // Show error message
      showFeedback("Failed to save event.", "error", $(this));
      console.error("Error saving to localStorage:", error);
    }
  });

  function showFeedback(message, type, $element) {
    var feedbackElement = $('<div>')
      .addClass(`feedback-message ${type}`)
      .text(message);
  
    // Append feedback near the save button
    $element.closest('.time-block').append(feedbackElement);
  
    // Automatically remove the feedback message after 3 seconds
    setTimeout(() => {
      feedbackElement.fadeOut(300, function() { $(this).remove(); });
    }, 3000);
  }

  var currentHour = dayjs().hour(); /* Get current number of hours. */
  
  // Update time block classes based on current hour
  $(".time-block").each(function () {
    var blockHour = parseInt($(this).attr("id").split("-")[1]);
  
    // Check the time and add the classes for background indicators
    if (blockHour < currentHour) {
      $(this).addClass('past').removeClass('present future');
    } else if (blockHour === currentHour) {
      $(this).addClass('present').removeClass('past future');
    } else {
      $(this).addClass('future').removeClass('past present');
    }
  });

  // Load saved events from localStorage
  $(".time-block").each(function () {
    var hourId = $(this).attr('id');
    try {
      var savedEvent = localStorage.getItem(hourId);
      if (savedEvent) {
        $(this).find('.description').val(savedEvent);
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  });

});
