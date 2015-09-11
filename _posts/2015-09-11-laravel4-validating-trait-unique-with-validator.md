---
layout: post
title: Extending Validating Traits for use with the UniqueWith Validator in Laravel 4
categories: [laravel4, model, validating, traits]
tags: []
---

The [Watson Validating](https://github.com/dwightwatson/validating) and the [Esensi Model Traits Package](https://github.com/esensi/model) traits don't play nicely with the [Felixkiss unique_with Validator Rule](https://github.com/felixkiss/uniquewith-validator). Here's a quick way to get them working in Laravel 4.

*NOTE: A minor change in the underlying code means this technique won't work for Laravel 5, but I've got a fix for that which I'll be posting shortly.*

# Trait Directory Setup

- Create an `app/traits` directory.
- Add an *`"app/traits"`* entry to the `autoload` `classmap` section of the *composer.json* file in Laravel's root directory.
- Run *`php artisan dump`* to update the class autoloader.

# Watson ValidatingTrait Instructions

If you're using the Watson ValidatingTrait, then you'll need to follow these instructions. If you're using the Esensi ValidatingModelTrait, skip these instructions, and follow the [Esensi section below](#esensi-validatingmodeltrait-instructions).

- Copy this gist as *app/traits/ValidatingTrait.php*

{% gist edd65d4c5e8bc013337d %}

Include this in the Model where you wish to use the ValidatingTrait:

```php
<?php
use \Traits\ValidatingTrait;
```

instead of:

```php
<?php
use \Watson\Validating\ValidatingTrait;
```

That's it, you're done. You can use the trait and validator together.

---

# Esensi\ValidatingModelTrait Instructions

- Copy this gist as *app/traits/ValidatingModelTrait.php*

{% gist 74ed7dd10ae5b28c1612 %}

Include this in the Model where you wish to use the ValidatingModelTrait:

```php
<?php
use \Traits\ValidatingModelTrait;
```

instead of:

```php
<?php
use \Esensi\Model\Traits\ValidatingModelTrait;
```

Et voila! They now work together as a team.
