function moveNumbers(num) {
    var txt=document.getElementById("result").value;
    txt=txt + num;
    document.getElementById("result").value=txt;
    }


function createButton() {
    var btn = document.createElement("BUTTON");
    var t = document.createTextNode("CLICK ME");
    btn.appendChild(t);
    document.body.appendChild(btn);
    }



// handlers.addTodo
window.onload = function() {
    if(sessionStorage.length !== 0) {
      var storedTodos = JSON.parse(sessionStorage.todoList);

          for (var i = 0; i < storedTodos.length; i++){
          var todo = storedTodos[i];
        if (todo.completed === true) {
          todoList.addTodo(todo.todoText, true);
        } else {
          todoList.addTodo(todo.todoText, false);
        }
        view.displayTodos();
     }
    }
  };

var todoList = {
    todos: [],
    persistTodos: function() {
      window.sessionStorage.setItem('todoList', JSON.stringify(this.todos));
    },
    addTodo: function(todoText, completed) {
      if (todoText) {
        this.todos.push({
          todoText: todoText,
          completed: completed,
        })
      };
      todoList.persistTodos();
    },
    changeTodo: function(position, todoText) {
      this.todos[position].todoText = todoText;
      todoList.persistTodos();
    },
    deleteTodo: function(position) {
      this.todos.splice(position, 1);
      todoList.persistTodos();
    },
    deleteAll: function() {
      if (confirm("Delete all items?")) {
        this.todos = [];
    } else {
         alert("Your list is safe.")
      };
    },
    toggleCompleted: function(position) {
      var todo = this.todos[position];
      todo.completed = !todo.completed;
      todoList.persistTodos();
    },
    toggleAll: function() {
      var totalTodos = this.todos.length;
      var completedTodos = 0;

      // Get number of completed todos.
      this.todos.forEach(function(todo) {
        if (todo.completed) {
          completedTodos++
        }
      });

      // Case 1: If everything’s true, make everything false.
      this.todos.forEach(function(todo) {
        if (completedTodos === totalTodos) {
          todo.completed = false;
      // Case 2: Otherwise, make everything true.
      } else {
          todo.completed = true;
      };
      });
      todoList.persistTodos();
    }
  };


var handlers = {
    addTodo: function() {
      // var newTodo = prompt("Enter your item:");
      // todoList.addTodo(newTodo);
      var addTextTodoInput = document.getElementById('addTodoTextInput');
      todoList.addTodo(addTextTodoInput.value, false);
      addTextTodoInput.value = '';
      view.displayTodos();
    },
    addSessionTodos: function(todoText) {
      todoList.addTodo(todoText);
      view.displayTodos();
    },
    changeTodo: function(position) {
      var todoText = prompt("Edit your item:");
        if (todoText) {
          todoList.changeTodo(position, todoText);
        }
      view.displayTodos();
    },
    deleteTodo: function(position) {
      todoList.deleteTodo(position);
      view.displayTodos();
    },
    deleteAll: function() {
      todoList.deleteAll();
      sessionStorage.clear();
      view.displayTodos();
    }
  };

  var view = {
    displayTodos: function() {
      var todosUl = document.querySelector('ul');
      todosUl.innerHTML = '';

      todoList.todos.forEach(function(todo, position) {
        var todoText = todo.todoText;
        var todoLi = document.createElement('li');
        var todoTextWithCompletion = '';

        if (todo.completed === true) {
          todoTextWithCompletion = '(x) ' + todoText;
        } else {
          todoTextWithCompletion = '(  ) ' + todoText;
        }

        todoLi.id = position;
        todoLi.textContent = todoTextWithCompletion;
        todoLi.appendChild(this.createDeleteButton());
        todoLi.appendChild(this.createEditButton());
        todoLi.appendChild(this.createCompleteButton());
        todosUl.appendChild(todoLi);
      }, this);
    },
    createDeleteButton: function() {
      var deleteButton = document.createElement('button');
      deleteButton.textContent = 'Remove';
      deleteButton.className = 'deleteButton';
      return deleteButton;
    },
    createCompleteButton: function() {
      var completeButton = document.createElement('button');
      completeButton.textContent = 'Done';
      completeButton.className = 'completeButton';
      return completeButton;
    },
    createEditButton: function() {
      var editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.className = 'editButton';
      return editButton;
    },
    setupEventListeners: function() {
      var todosUl = document.querySelector('ul');

      todosUl.addEventListener('click', function(event) {
        var elementClicked = event.target;

        if (elementClicked.className === 'deleteButton') {
          handlers.deleteTodo(parseInt(elementClicked.parentNode.id));
        };
        if (elementClicked.className === 'completeButton') {
          handlers.toggleCompleted(parseInt(elementClicked.parentNode.id));
        };
        if (elementClicked.className === 'editButton') {
          handlers.changeTodo(parseInt(elementClicked.parentNode.id));
        }
      });

      document.addEventListener('keydown', function(event) {
        if (event.keyCode == 13) {
          handlers.addTodo();
        }
      }, true);

    }
  };

  view.setupEventListeners();
