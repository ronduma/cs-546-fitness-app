(function ($) {
    var newExerciseForm = $('#scheduler-form'),
        newNameInput = $('#exerciseName'),
        newDayInput = $('#dayOfWeek'),
        newWeightInput  = $('#exerciseWeight'),
        newNumSetsInput = $('#numSets'),
        newNumRepsInput = $('#numReps'),
        newBodyGroupInput = $('#bodyGroup'),
        wholePage = $('#main-page-AJAX');

    newExerciseForm.submit(function (event) {
        event.preventDefault();

        var newName = newNameInput.val();
        var newDay = newDayInput.val();
        var newWeight = newWeightInput.val();
        var newNumSets = newNumSetsInput.val();
        var newNumReps = newNumRepsInput.val();
        var newBodyGroup = newBodyGroupInput.val();

        if(newName && newDay && newWeight && newNumSets && newNumReps && newBodyGroup){
            var requestConfig = {
                method: 'POST',
                url: '/scheduler',
                contentType: 'application/json',
                data: JSON.stringify({
                    exerciseName: newName,
                    exerciseWeight: newWeight,
                    numSets: newNumSets,
                    numReps: newNumReps,
                    dayOfWeek: newDay,
                    bodyGroup: newBodyGroup
                })
            };
            $.ajax(requestConfig).then(function(responseMessage){
                console.log(responseMessage);
                var newPage = $(responseMessage);
                wholePage.replaceWith(newPage);
            });
        }
    })

})(window.jQuery);