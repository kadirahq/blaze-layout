# BlazeLayout (kadira:blaze-layout) [![Build Status](https://travis-ci.org/kadirahq/blaze-layout.svg?branch=master)](https://travis-ci.org/kadirahq/blaze-layout)

> This project is earlier known as **meteorhacks:flow-layout**. This is an exact copy of FlowLayout but in a different name.

### Blaze Layout Manager for Meteor

This is a layout manager designed for Blaze. This is built to use with FlowRouter but, this can be used without FlowRouter too. This is a very simple layout manager. It will does following:

* Allow you to render a layout template to the UI
* Allow you to pass data to the layout
* Only re-render when necessary parts of the layout
* Can be used with multiple layouts

## Usage

First install BlazeLayout with:

~~~
meteor add kadira:blaze-layout
~~~

Then create following few templates

~~~html
<template name="layout1">
  {{> Template.dynamic template=top}}
  {{> Template.dynamic template=main}}
</template>

<template name="header">
  <h1>This is the header</h1>
</template>

<template name="postList">
  <h2>This is the postList area.</h2>
</template>

<template name="singlePost">
  <h2>This is the singlePost area.</h2>
</template>
~~~

Now you can render the layout with:

~~~js
BlazeLayout.render('layout1', { top: "header", main: "postList" });
~~~

Then you will get output like below:

~~~html
  <h1>This is the header</h1>
  <h2>This is the postList area.</h2>
~~~

Sometimes later, you can render the layout again:

~~~js
BlazeLayout.render('layout1', { top: "header", main: "singlePost" });
~~~

Since only the `main` is changed, `top` section won't get re-rendered. Here's the HTML you'll get:

~~~html
  <h1>This is the header</h1>
  <h2>This is the singlePost area.</h2>
~~~

### Rendering Multiple Templates

Likewise you can create multiple templates and switch between each other.
But when you are changing the layout, whole UI will get re-rendered again.

So, it's a good idea to use a few layouts if possible.

### Set Different Root Node

By default, BlazeLayout render layouts into a DOM element with the id `__blaze-root`. Sometimes, you may need to change it or just render layouts into the body. If so, here's how to do it.

Add following code inside on the top of one of your client side JS file:

~~~js
BlazeLayout.setRoot('body');
~~~

You can set any CSS selector or any jQuery object as the root.
