import {Prism} from '../prismjs/prism.js';

document.addEventListener('DOMContentLoaded', (event) => {
  //syntax highlight
  syntaxHighlight();
  navigation();
  pageTitle();
  //add meta 
  //document.head.insertAdjacentHTML('afterbegin', '<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">');
  replaceParams();
  doQuizz();

});

function pageTitle(){
  var title = document.createElement("title");
  title.textContent = document.querySelector('header h1').textContent;
  document.head.appendChild(title);
}

function syntaxHighlight(){
  document.querySelectorAll('code,incode').forEach((block) => {
    if(block.nodeName === 'CODE'){
      var preWrap = document.createElement('pre');
      if(block.hasAttribute('data-line')){
        preWrap.setAttribute('data-line', block.getAttribute('data-line'));
      }
      block.parentNode.insertBefore(preWrap, block);
      preWrap.appendChild(block);
    }

    var attrs = block.getAttributeNames();
    if(attrs[0] != null){
      block.removeAttribute(attrs[0]);
      block.classList.add('language-' + attrs[0]);
    }
    
    Prism.highlightElement(block);
  });

  document.querySelectorAll('shell').forEach((block) => {
    var preWrap = document.createElement('pre');
    block.parentNode.insertBefore(preWrap, block);
    preWrap.appendChild(block);
    
    block.classList.add('language-bash');
    
    Prism.highlightElement(block);
  });
}

function navigation(){
  // add sidenav and nav
  document.querySelectorAll('nav').forEach((nav) => {
    var hambopen = document.createElement('hamb-open');
    var sidenav = document.createElement('sidenav');
    var hambclose = document.createElement('hamb-close');
  
    nav.appendChild(hambopen);
    sidenav.appendChild(hambclose);
  
    document.body.appendChild(nav);
    document.body.appendChild(sidenav);
  
    // build sidenav menu
    document.querySelectorAll('h2').forEach((h,i) => {
      //var id = 'id' + Math.random().toString(36).substr(2, 9);
      var id = 'section' + (i+1);
      h.id = id;
  
      var link = document.createElement('a');
      link.href = '#' + id;
      link.textContent = h.textContent;
      link.onclick = () => {
        sidenav.classList.remove('open');
      }
      sidenav.appendChild(link);
    });
  
    // sidenav open/close
    hambopen.onclick = () => {
        sidenav.classList.add('open');
    };
  
    hambclose.onclick = () => {
      sidenav.classList.remove('open');
    };
  
    // nav show/hide
    var prevScrollpos = window.pageYOffset;
    window.onscroll = function() {
        var currentScrollPos = window.pageYOffset;
        if (prevScrollpos > currentScrollPos) {
          nav.classList.remove('hide');
        } else {
          nav.classList.add('hide');
        }
        prevScrollpos = currentScrollPos;
    }
  });
}

function replaceParams(){
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const entries = urlParams.entries();
  for(const entry of entries) {
    if(entry[0].startsWith('replace-')){
      const name = entry[0].slice(8);
      document.querySelectorAll(name).forEach((e) => {
        e.textContent = entry[1];
      });
    }
  }
}







function doQuizz(){
  document.querySelectorAll('question').forEach(q => {
    var qid = 'id' + Math.random().toString(36).substr(2, 9);
    q.id = qid;
    
    var button = document.createElement('button');
    button.classList.add('check');
    q.appendChild(button);

    if(q.hasAttribute('single')){
      doSingleQuestion(q);
    } else if(q.hasAttribute('multi')){
      doMultiQuestion(q);
    } else if(q.hasAttribute('match')){
      doMatchQuestion(q);
    }
  });
}

function doSingleQuestion(q){
  q.querySelectorAll('o').forEach(o => {
    var iid = 'id' + Math.random().toString(36).substr(2, 9);

    var label = document.createElement('label');
    label.innerHTML = o.innerHTML;
    o.innerHTML = '';
    label.setAttribute('for', iid);
    o.appendChild(label);

    var i = document.createElement('input');
    i.id = iid;
    i.type = 'radio';
    i.name = q.id;
    o.insertBefore(i, o.firstChild);
    o.onclick = () => {
      i.click();
    }
  });
  
  q.querySelector('button.check').onclick = () => {
    q.querySelectorAll('o').forEach(o => {
      o.classList.remove('right');
      o.classList.remove('wrong');
      o.classList.remove('was-correct');

      o.querySelectorAll('input').forEach(i => {
        if(i.checked){
          if(o.hasAttribute('correct')){
            o.classList.add('right');
            o.classList.add('was-correct');
          } else {
            o.classList.add('wrong');
          }
        } else {
          if(o.hasAttribute('correct')){
            o.classList.add('was-correct');
          }
        }
      });
    });
  };
}

function doMultiQuestion(q){
  q.querySelectorAll('o').forEach(o => {
    var iid = 'id' + Math.random().toString(36).substr(2, 9);

    var label = document.createElement('label');
    label.innerHTML = o.innerHTML;
    o.innerHTML = '';
    label.setAttribute('for', iid);
    o.appendChild(label);

    var i = document.createElement('input');
    i.id = iid;
    i.type = 'checkbox';
    o.insertBefore(i, o.firstChild);
    o.onclick = () => {
      i.click();
    }
  });

  q.querySelector('button.check').onclick = () => {
    q.querySelectorAll('o').forEach(o => {
      o.classList.remove('right');
      o.classList.remove('wrong');
      o.classList.remove('was-correct');

      o.querySelectorAll('input').forEach((i) => {
        if(i.checked){
          if(o.hasAttribute('correct')){
            o.classList.add('right');
            o.classList.add('was-correct');
          } else {
            o.classList.add('wrong');
          }
        } else {
          if(o.hasAttribute('correct')){
            o.classList.add('wrong');
            o.classList.add('was-correct');
          }
        }
      });
    });
  };
}

function doMatchQuestion(q){
  var leftdiv = document.createElement('div');
  leftdiv.classList.add('left');
  var rightdiv = document.createElement('div');
  rightdiv.classList.add('right');
 
  q.insertBefore(rightdiv, q.querySelector('button'));
  q.insertBefore(leftdiv, rightdiv);

  // sortable
  q.querySelectorAll('o').forEach((o, i) => {
    var div = leftdiv;
    if(i%2==1){
      o.id = 'o' + (i);
      o.setAttribute('order', Math.floor(i/2));
      div = rightdiv;
    }
    div.appendChild(o);
  });

  // shuffle
  suffleChildren(rightdiv);
  swapable(rightdiv);

  // check
  q.querySelector('button.check').onclick = () => {
      rightdiv.querySelectorAll('o').forEach((o, i) => {
      o.classList.remove('right');
      o.classList.remove('wrong');

      if(o.getAttribute('order') != i){
        o.classList.add('wrong');
      } else {
        o.classList.add('right');
      }
    });
  }
}

var overElement;
function swapable(d){
  d.querySelectorAll("*").forEach(e => {
    e.setAttribute("draggable", true);

    e.ondragend = (event) => {
      overElement.classList.remove("highlight");
      overElement.classList.remove("right");
      overElement.classList.remove("wrong");
      event.target.classList.remove("right");
      event.target.classList.remove("wrong");
      swapElements(event.target, overElement);
    };
    e.ondragover = (event) => {
      overElement = event.target;
      overElement.classList.add("highlight");
    };
    e.ondragleave = (event) => {
        overElement.classList.remove("highlight");
    };
  });
}


function swapElements(a, b){
  var n = a.nextSibling;
  if(b == n){
    insertBefore(b, a);
  } else {
    insertBefore(a, b);
    insertBefore(b,n);
  }
}

function insertBefore(a, b){
  if(b != null){
    b.parentNode.insertBefore(a, b);
  } else {
    a.parentNode.appendChild(a);
  }
}

function suffleChildren(d){
  var n = d.childElementCount;
  for(var i=0; i<n-1; i++){
    var j = randInt(i+1, n);
    var a = d.children[i];
    var b = d.children[j];

    swapElements(a, b);
  }
}

function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
