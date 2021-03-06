var query       = require("./"),
    randomColor = require('random-color');

var HTML = (function(){/*
                        <textarea style="width:300px; height:200px"></textarea>
                        <ul data-foo="bar" class="fruits">
                        <li class="fruit">apple</li>
                        <li class="fruit">orange</li>
                        <li class="fruit">plum</li>
                        </ul>
                        */}).toString().slice(17, -4);

function fruits(){
  return Array.prototype.slice.call(document.querySelectorAll('.fruits .fruit'));
}

before(function(done){
  document.body.innerHTML += HTML;

  query('textarea').on('> alt space', function(){
    query('textarea').val('');
  });

  done();
});

it('returns an attr value', function(){
  expect(query('.fruits').attr('data-foo')).to.equal('bar');
});

it('sets an attr value', function(){

  query('.fruit').attr('data-foo', 'bar').style('background-color', randomColor());

  fruits().forEach(function(el){
    expect(el.getAttribute('data-foo')).to.equal('bar');
  });

});


it('selects elements by css queries', function(){

  var els   = query('.fruits .fruit'),
      clone = document.querySelectorAll('.fruits .fruit');

  expect(els[0]).to.equal(clone[0]);
  expect(els[1]).to.equal(clone[1]);

});

it('hides els', function(){
  query('.fruit').hide();

  fruits().forEach(function(el){
    expect(el.style.display).to.equal('none');
  });
});

it('shows els', function(){

  fruits().forEach(function(el){
    el.style.display = 'none';
  });

  query('.fruit').show();

  fruits().forEach(function(el){
    expect(el.style.display).to.equal('');
  });

});

it('adds a class', function(){
  query('.fruit').addClass('foo');

  fruits().forEach(function(el){
    expect(el.classList.contains('foo')).to.be.true;
  });

});

it('removes a class', function(){
  query('.fruit').addClass('foo').addClass('bar').removeClass('foo');

  fruits().forEach(function(el){
    expect(el.classList.contains('bar')).to.be.true;
    expect(el.classList.contains('foo')).to.be.false;
  });

});

it('checks an element if it has a class', function(){
  query('.fruit').removeClass('foo').removeClass('bar');

  fruits().forEach(function(el){
    expect(el.classList.contains('foo')).to.be.false;
    expect(el.classList.contains('bar')).to.be.false;
    expect(el.classList.contains('fruit')).to.be.true;
  });
});

it('toggles a class', function(){

  query('.fruit').addClass('foo').removeClass('bar').toggleClass('foo').toggleClass('bar');

  fruits().forEach(function(el){
    expect(el.classList.contains('foo')).to.be.false;
    expect(el.classList.contains('bar')).to.be.true;
  });

});

it('styles an element', function(){
  query('.fruit').style({ color: 'red', 'background-color': 'yellow' }).style('border', '1px solid green');

  fruits().forEach(function(el){
    expect(el.style.color).to.equal('red');
    expect(el.style.backgroundColor).to.equal('yellow');
    expect(el.style.border).to.equal('1px solid green');
  });
});

it('adds an event', function(){

  query('.fruit').click(function(event){
    query(event.target).style({ 'background-color': randomColor(), 'color': randomColor() });
  });

  query('textarea')
    .keydown(function(){
      query('textarea').style('background-color', randomColor());
    });

});

it('returns the value of an element', function(){
  query('textarea')[0].value = 'hello';
  expect(query('textarea').val()).to.equal('hello');
});

it('sets the value of an element', function(){
  query('textarea').val('foobar').style('background-color', randomColor());
  expect(query('textarea').val()).to.equal('foobar');
});

it('returns the text content of an element', function(){
  query('.fruit:first-child')[0].innerText = 'grape';
  expect(query('.fruit:first-child').text()).to.equal('grape');
});

it('sets the text content of an element', function(){
  query('.fruit:first-child').text('a delicious {fruit}', { fruit: 'cherry' }).style('background-color', randomColor());
  expect(query('.fruit:first-child').text()).to.equal('a delicious cherry');

  query('.fruit:first-child').text('tasty cherries').style('background-color', randomColor());
  expect(query('.fruit:first-child').text()).to.equal('tasty cherries');
});

it('returns the html content of an element', function(){
  query('.fruit:first-child')[0].innerHTML = 'kiwi';
  expect(query('.fruit:first-child').html()).to.equal('kiwi');
});

it('sets the html content of an element', function(){
  query('.fruit:first-child').html('a delicious {fruit}', { fruit: 'melon' }).style('background-color', randomColor());
  expect(query('.fruit:first-child').html()).to.equal('a delicious melon');
  query('.fruit:first-child').html('a tasty melon').style('background-color', randomColor());
  expect(query('.fruit:first-child').html()).to.equal('a tasty melon');
});

it('creates a new element', function(){
  var parent = query.create('div').addClass('parent'),
      child1 = query.create('<p>child 1</p>'),
      child2 = query.create('span').html('child 2'),
      child3 = query.create('<label>child 3</label>'),
      child4 = query.create('strong').html('child 4');

  parent.add(child1).add(child2).replace(child1, child3).add(child4).remove('span');

  expect(parent.html()).to.equal('<label>child 3</label><strong>child 4</strong>');
  expect(parent.hasClass('parent')).to.be.true;
});

it('adds a child element', function(){
  var child = query.create('li').addClass('fruit').addClass('new').html('yo');
  query('.fruits').add(child);
  expect(query('.fruit:last-child')[0]).to.be.equal(child[0]);
});

it('adds HTML', function(){
  query('.fruits').add('<li class="new fruit">a fresh {fruit}</li>', { fruit: 'watermelon' });
  expect(query('.fruit:last-child').hasClass('new')).to.be.true;
  expect(query('.fruit:last-child').hasClass('fruit')).to.be.true;
  expect(query('.fruit:last-child').text()).to.be.equal('a fresh watermelon');

  query('.fruits').add('<li class="new fruit">a very fresh apple</li>');
  expect(query('.fruit:last-child').hasClass('new')).to.be.true;
  expect(query('.fruit:last-child').hasClass('fruit')).to.be.true;
  expect(query('.fruit:last-child').text()).to.be.equal('a very fresh apple');
});

it('creates and inserts HTML', function(){
  query('<li class="new very-new fruit">very fresh {fruit}</li>', { fruit: 'peach' }).insert('.fruits');
  expect(query('.fruit:last-child').hasClass('new')).to.be.true;
  expect(query('.fruit:last-child').hasClass('very-new')).to.be.true;
  expect(query('.fruit:last-child').hasClass('fruit')).to.be.true;
  expect(query('.fruit:last-child').text()).to.be.equal('very fresh peach');
});

it('removes itself', function(){
  var last = query('.fruit:last-child').text();
  query('<li class="fruit">to be removed</li>').insert('.fruits');
  expect(query('.fruit:last-child').text()).to.be.equal('to be removed');
  query('.fruit:last-child').remove();
  expect(query('.fruit:last-child').text()).to.be.equal(last);
});

it('selects the children', function(){
  var newf  = query('.fruits').select('.new'),
      clone = query('.fruits .new');
  expect(newf.length).to.equal(clone.length);
});

it('initializes a chain with given elements', function(){

  query.apply(undefined, Array.prototype.slice.call(document.querySelectorAll('.fruit'))).removeClass('corge').addClass('corge');

  fruits().forEach(function(el){
    expect(el.classList.contains('corge')).to.be.true;
  });

});
