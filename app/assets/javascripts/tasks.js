$(function(){
	// taskHtml produces an HTML representation of tasks
	// with <li> tags
	function taskHtml(task) {
		var checkedStatus = task.done ? "checked" : "";
		var liClass = task.done ? "completed" : "";
		var liElement = '<li id="listItem-' + task.id + '"class="' + liClass + '">' + 
			'<div class="view"><input class="toggle" type="checkbox"' + 
			" data-id='" + task.id + "'" + 
			checkedStatus +
			'><label>'+ 
			task.title + 
			'</label></div></li>';
			
			return liElement;
		}
	// Takes the html representation
	// of data and toggles the 'done' field
	function toggleTask(e) {
		var itemId = $(e.target).data("id");

		var doneValue = Boolean($(e.target).is(':checked'));

		$.post("/tasks/" + itemId, {
			_method: "PUT",
			task: {
				done: doneValue
			}
		}).success(function(data) {
			var liHtml = taskHtml(data);
			var $li = $("#listItem-" + data.id);
			$li.replaceWith(liHtml);
			$('.toggle').change(toggleTask);
		});
	}
	// Takes tasks, converts to html, and toggles its state	
	$.get('/tasks').success( function( data ){
		var htmlString = "";
		
		$.each(data, function(index, task) {
			
			htmlString += taskHtml(task);
		});
		var ulTodos = $('.todo-list');
		ulTodos.html(htmlString);

		$('.toggle').change(toggleTask);

	});
	
	// Adds new tasks to the list 	
	$('#new-form').submit(function(event){
		event.preventDefault();
		var textbox = $('.new-todo');
		var payload = {
			task: {
				title: textbox.val()
			}
		};
		$.post("/tasks", payload).success(function(data){
			var htmlString = taskHtml(data);
			var ulTodos = $('.todo-list');
			ulTodos.append(htmlString);
			$('.toggle').click(toggleTask);
			$('.new-todo').val('');
		});
	});

});
