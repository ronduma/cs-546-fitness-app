(function ($) {
    var newExerciseForm = $('#scheduler-form'),
        newNameInput = $('#exerciseName'),
        newDayInput = $('#dayOfWeek'),
        newWeightInput  = $('#exerciseWeight'),
        newNumSetsInput = $('#numSets'),
        newNumRepsInput = $('#numReps'),
        newBodyGroupInput = $('#bodyGroup')

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
                var oldMess = document.getElementById('response-message');
                console.log(oldMess)
                let h1 = document.createElement('h1');
                h1.innerHTML = responseMessage.message;
                h1.className = 'header-spacing';
                h1.id='response-message';
                oldMess.replaceWith(h1);
                event.preventDefault();
            });
        }
    })

})(window.jQuery);