(function () {
    const schedulerForm = document.getElementById('scheduler-form');
    const exerciseList = document.getElementById('exercise-form');
    const updateButton = document.getElementById('addExerciseButton');
    updateButton.addEventListener('click', () => {
        document.createElement('label', {for: 'exerciseName', class: 'input-param', value: 'Exercise Name'})
        exerciseList.append(`<label for="exerciseName" class="input-param">Exercise Name: </label>`);
        exerciseList.innerHTML = exerciseList.innerHTML + `<input type="text" name="exerciseName" id="exerciseName" required="required" placeholder="Exercise Name"> <br>`
        exerciseList.innerHTML = exerciseList.innerHTML + `<label for="exerciseWeight" class="input-param">Exercise Weight</label>`
        exerciseList.innerHTML = exerciseList.innerHTML + `<input type="number" name="exerciseWeight" id="exerciseWeight" required="required" placeholder="Exercise Weight"><br>`
        exerciseList.innerHTML = exerciseList.innerHTML + `<label for="numSets" class="input-param">Number of Sets: </label>`
        exerciseList.innerHTML = exerciseList.innerHTML + `<input type="number" name="numSets" id="numSets" required="required" placeholder="Number of Sets"><br>`
        exerciseList.innerHTML = exerciseList.innerHTML + `<label for="numReps" class="input-param">Number of Reps: </label>`
        exerciseList.innerHTML = exerciseList.innerHTML + `<input type="number" name="numReps" id="numReps" required="required" placeholder="Number of Reps">`
    });
})();