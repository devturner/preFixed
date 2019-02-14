function moveNumbers(num) {
    var txt=document.getElementById("result").value;
    txt=txt + num + ' ';
    document.getElementById("result").value=txt;
  };

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
      if (confirm("This will delete all items!")) {
        this.todos = [];
      } 
    },
    searchTodo: function(position) {
      var slider = document.getElementsByClassName("slider_search")[0];
      var todo = this.todos[position];
      moveNumbers(todo.todoText);
      document.getElementById("result").focus();
      slider.classList.add("slided_prefix");
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
    searchTodo: function(position) {
      todoList.searchTodo(position);
      view.displayTodos();
    },
    toggleCompleted: function(position) {
      todoList.toggleCompleted(position);
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
        todoLi.className = 'card'
        todoLi.id = position;
        var custLength = 20;
        todoLi.textContent.className = 'small';
        if (todoText.length >= custLength) {
          todoLi.innerHTML = "<span class ='prefixed_text'>" + todoText.substring(0,custLength) + '...' + "</span>";
        } else {
          todoLi.innerHTML = '<span class ="prefixed_text">' + todoText + '</span>';
        }

        todoLi.appendChild(this.createSearchButton());
        todoLi.appendChild(this.createDeleteButton());
        todosUl.appendChild(todoLi);
      }, this);
    },
    createDeleteButton: function() {
      var deleteButton = document.createElement('button');
      deleteButton.innerHTML = "<i class='material-icons delete_icon'>delete_forever</i>";
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
    createSearchButton: function() {
      var searchButton = document.createElement('button');
      searchButton.innerHTML = "<i class='material-icons'>search</i>";
      searchButton.className = 'searchButton';
      // searchButton.style.cssFloat = 'left'
      return searchButton;
    },

    setupEventListeners: function() {
      var todosUl = document.querySelector('ul');

      todosUl.addEventListener('click', function(event) {
        var elementClicked = event.target;

        if (elementClicked.className === 'deleteButton') {
          console.log('delete button')
          handlers.deleteTodo(parseInt(elementClicked.parentNode.id));
        };

        if (elementClicked.className === 'searchButton') {
          console.log('search button')
          handlers.searchTodo(parseInt(elementClicked.parentNode.id));
        }
      });

      document.addEventListener('keydown', function(event) {
        if (event.keyCode == 13) {
          handlers.addTodo();
        }
      }, true);

      document.addEventListener('click', function(event){
        var elementClicked = event.target;

        if (elementClicked.className === 'lucky') {
          var luckyElement = document.getElementById("result");
          var url = "https://www.google.com/search?q=" + luckyElement.value + "&btnI";
          
          url = url.replace(/ /g,'+')
          window.open(url, "_blank");
          document.getElementById("result").value = "";
          return true;
        };

        if (elementClicked.className === 'reg') {
          var luckyElement = document.getElementById("result");
          var url = "https://www.google.com/search?q=" + luckyElement.value;
          
          url = url.replace(/ /g,'+')
          window.open(url, "_blank");
          document.getElementById("result").value = "";
          return true;
        };
        
        if (elementClicked.className === 'expander_prefix') {
          var slider = document.getElementsByClassName("slider_prefix")[0];
          console.log('prefix slider')
          if (slider.classList.contains("slided_prefix")) {
            slider.classList.remove("slided_prefix");
          } else {
            slider.classList.add("slided_prefix");
          } return true;
        };

        if (elementClicked.className === 'expander_search') {
          var slider = document.getElementsByClassName("slider_search")[0];
          console.log('search slider')
          if (slider.classList.contains("slided_search")) {
            slider.classList.remove("slided_search");
          } else {
            slider.classList.add("slided_search");
          } return true;
        };



      }, true);
    }
  };

  view.setupEventListeners();
  