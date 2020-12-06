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
      .then(function(response) {
        if (response.status !== 200)  {
          console.log("Error");
        }
        else  {
          console.log("no error");
        }
      })
      return false;
    }
  }

});
