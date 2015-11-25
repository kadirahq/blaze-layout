# Change Log

### v2.3.0
* Use Blaze's DOMBackend API. See: [#38](https://github.com/kadirahq/blaze-layout/pull/38)
* Display an error when there is no template. See: [#48](https://github.com/kadirahq/blaze-layout/pull/49)

### v2.2.0
* Add support for rootNode is defined via a template. Gives better support for BlazeComponents. See: [#50](https://github.com/kadirahq/blaze-layout/pull/50)
* Add tracker to the package list

### v2.1.0
* Explicitly depend on jQuery

### v2.0.1
* Set a default value for regions if it's empty. Solves [FlowRouter/#283](https://github.com/kadirahq/flow-router/issues/283)

### kadira:blaze-layout@2.0.0
* Rename the namespace as BlazeLayout
* Move package into `kadira:blaze-layout`

### v1.4.2

* Fix [#32](https://github.com/meteorhacks/flow-layout/issues/32) - Where flow layout does not clean removed regions

### v1.4.1

* Fix a load order issue where FlowLayout starts to render before the ROOT node inserted to DOM. See issue [#25](https://github.com/meteorhacks/flow-layout/issues/25)

### v1.4.0

* Fix an issue when invoked changing layouts before the previous layout didn't get rendered yet. See the [issue](https://github.com/meteorhacks/flow-router/issues/132#issuecomment-106950588).

