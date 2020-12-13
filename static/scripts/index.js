document.addEventListener("DOMContentLoaded", function()  {

  if (document.querySelector("#extra_candidates"))  {

    document.getElementById('to').value = new Date("YYYY-MM-DD");
    
    const extra = document.querySelector("#extra_candidates");
    var count = 2;


    const add = document.querySelector("#add_candidate");
    const remove = document.querySelector("#remove_candidate");

    check_remove();

    add.onclick = function()  {
      count++;
      extra.innerHTML += `<div id="Candidate__${count}"><label for="exampleFormControlSelect${count}">Enter name of Candidate ${count}</label> <input class="form-control candidates_name" type="text" id="Candidate_${count}"><br></div>`
      check_remove();
    }

    remove.onclick = function()  {
      document.querySelector(`#Candidate__${count}`).remove();
      count--;
      check_remove();
    }

    
    function check_remove()  {
      if (count > 2)  {
        remove.style.display = "inline";
      }
      else  {
        remove.style.display = "None";
      }

      if (count > 4)  {
        add.style.display = "None";
      }
      else  {
        add.style.display = "inline";
      }
    }
  
    document.querySelector("#conduct_election").onsubmit = function()  {
      var data = new Object();
      for (var i of this.elements)  {
        if (i.type === "text" || i.type === "date")  {
          data[i.id] = i.value;
        }
      }
      console.log(data);
      fetch("/new_election", {
        method: "POST",
        body: JSON.stringify({
          data: data
        })
      })
      .then(response => response.json())
      .then(function(response) {
        if (response.status !== 200)  {
          console.log(response);
        }
        else  {
          console.log(response.message); 
        }
      })

      $('#exampleModal').modal('hide');
      return false;
    }
  }

  document.querySelector("#current").onclick = function() {
    fetch("/current_election")
    .then(response => response.json())
    .then(function(response) {
      console.log(response.data[2])
      if (response.status === 201)  {
        var current = document.querySelector("#current_candidates");
        for (var i = 0; i < response.data.length; i++)  {
          var input = document.createElement("input");
          var label = document.createElement("label");
          label.innerHTML = label.for = input.id = input.value = response.data[i];
          input.name = "candidate_name";
          input.type = "radio";
          current.appendChild(label);
          current.appendChild(input);
        }
      }
      else  {
        console.log(response);
      }
    });
  }


    document.querySelector("#current_election").onsubmit = function()  {
      var cands = document.getElementsByName("candidate_name");
      for (var i = 0; i < cands.length; i++)  {
        if (cands[i].checked)  {
          var name = cands[i].value;
          break;
        }
      }
      console.log(name);
      fetch("/current_election", {
        method: "POST",
        body: JSON.stringify({
          cand_name: name 
        })
      })
      .then(response => response.json())
      .then(function(response) {
        if (response)  {
          console.log(response.data);
        }
        else  {
          console.log(response.data); 
        }
      })
      $('#current_election').modal('hide');
      return false;
    }

  document.querySelector("#completed").onclick = function() {
    fetch("/completed_election")
    .then(function(response) {
      if (response.status === 201)  {
        console.log(data);
      }
      else  {
        console.log("error");
      }
    });
    $('#completed_election').modal('show')
  }
});
