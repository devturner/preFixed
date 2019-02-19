function searchBar(num) {
    var txt=document.getElementById("result").value;
    txt=txt + num + ' ';
    document.getElementById("result").value=txt;
  };

  window.onload = function() {
    if(localStorage.length !== 0) {
      var storedPrefixes = JSON.parse(localStorage.prefixList);
      for (var i = 0; i < storedPrefixes.length; i++){
        var prefix = storedPrefixes[i];
        prefixList.addPrefix(prefix.prefixText, false)
        view.displayPrefixes();
      }
    }
    if(localStorage.length === 0 || localStorage.prefixList.length < 3) {
      handlers.slidePrefix()
    }
  };


var prefixList = {
    prefixes: [],
    persistPrefixes: function() {
      window.localStorage.setItem('prefixList', JSON.stringify(this.prefixes));
    },
    addPrefix: function(prefixText, completed) {
      if (prefixText) {
        this.prefixes.push({
          prefixText: prefixText,
          completed: completed,
        })
      };
      prefixList.persistPrefixes();
    },
    undoPrefix: function(position) {
      document.getElementById("result").value = "";
      handlers.slideSearch()
      prefixList.persistPrefixes();
    },
    deletePrefix: function(position) {
      this.prefixes.splice(position, 1);
      prefixList.persistPrefixes();
      if(localStorage.length === 0 || localStorage.prefixList.length < 3) {
        handlers.slidePrefix()
      }
    },
    deleteAll: function() {
      if (confirm("This will delete all items!")) {
        this.prefixes = [];
      }
    },
    searchPrefix: function(position) {
      var prefix = this.prefixes[position];
      searchBar(prefix.prefixText);
      document.getElementById("result").focus();
      handlers.slideSearch()

    },
  };

var handlers = {
    addPrefix: function() {
      var addTextPrefixInput = document.getElementById('addprefixTextInput');
      prefixList.addPrefix(addTextPrefixInput.value, false);
      addTextPrefixInput.value = '';
      view.displayPrefixes();
    },
    addSessionPrefixes: function(prefixText) {
      prefixList.addPrefix(prefixText);
      view.displayPrefixes();
    },
    undoPrefix: function(position) {
      prefixList.undoPrefix(position)
      view.displayPrefixes();
    },
    searchPrefix: function(position) {
      prefixList.searchPrefix(position);
      view.displayPrefixes();
    },

    deletePrefix: function(position) {
      prefixList.deletePrefix(position);
      view.displayPrefixes();
    },
    deleteAll: function() {
      prefixList.deleteAll();
      localStorage.clear();
      view.displayPrefixes();
    },
    slideSearch: function() {
      var slider = document.getElementsByClassName("slider_search")[0];
      var val = document.getElementById("result").value
        if ((slider.classList.contains("slided_search")) && (val === "")) {
          slider.classList.remove("slided_search");
        } else {
          slider.classList.add("slided_search");
          document.getElementById("result").focus();
      } return true;

    },
    slidePrefix: function() {
      var slider = document.getElementsByClassName("slider_prefix")[0];
        if (slider.classList.contains("slided_prefix")) {
          slider.classList.remove("slided_prefix");
        } else {
          slider.classList.add("slided_prefix");
          document.getElementById("addprefixTextInput").focus();
      } return true;
    }
  };

  var view = {
    displayPrefixes: function() {
      var prefixesUl = document.querySelector('ul');
      prefixesUl.innerHTML = '';

      prefixList.prefixes.forEach(function(prefix, position) {
        var prefixText = prefix.prefixText;
        var prefixLi = document.createElement('li');
        prefixLi.className = 'card'
        prefixLi.id = position;
        var custLength = 20;
        prefixLi.textContent.className = 'small';
        if (prefixText.length >= custLength) {
          prefixLi.innerHTML = "<span class ='prefixed_text'>" + prefixText.substring(0,custLength) + '...' + "</span>";
        } else {
          prefixLi.innerHTML = '<span class ="prefixed_text">' + prefixText + '</span>';
        }

        prefixLi.appendChild(this.createSearchButton());
        prefixLi.appendChild(this.createUndoButton());
        prefixLi.appendChild(this.createDeleteButton());
        prefixesUl.appendChild(prefixLi);
      }, this);
    },
    createDeleteButton: function() {
      var deleteButton = document.createElement('button');
      deleteButton.innerHTML = "<i class='material-icons delete_icon'>delete_forever</i>";
      deleteButton.className = 'deleteButton';
      return deleteButton;
    },
    createUndoButton: function() {
      var undoButton = document.createElement('button');
      undoButton.innerHTML = "<i class='material-icons'>undo</i>";
      undoButton.className = 'undoButton';
      return undoButton;
    },
    createSearchButton: function() {
      var searchButton = document.createElement('button');
      searchButton.innerHTML = "<i class='material-icons'>search</i>";
      searchButton.className = 'searchButton';
      return searchButton;
    },

    setupEventListeners: function() {
      var prefixesUl = document.querySelector('ul');

      prefixesUl.addEventListener('click', function(event) {
        var elementClicked = event.target;

        if (elementClicked.className === 'deleteButton') {
          handlers.deletePrefix(parseInt(elementClicked.parentNode.id));
        }

        if (elementClicked.className === 'searchButton') {
          handlers.searchPrefix(parseInt(elementClicked.parentNode.id));
        }

        if (elementClicked.className === 'undoButton') {
          handlers.undoPrefix(parseInt(elementClicked.parentNode.id));
        }

      });

      document.addEventListener('keydown', function(event) {
        if (event.keyCode == 13) {
          handlers.addPrefix();
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
          handlers.slidePrefix()
        };

        if (elementClicked.className === 'expander_search') {
          handlers.slideSearch()
        };

      }, true);
    }
  };

  view.setupEventListeners();
