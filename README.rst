Simple node-readabiliy API
--------------------------

This is a very thin wrapper arround `node-readabiliy <https://github.com/arrix/node-readability>`_

Usage
-----

Send your html as a *POST* request (and encode it in *utf-8*) to ``http://yourdomain:8080/extract/`` and you'll get a *JSON* response.

**JSON response format**

::

	{	
		"result": RESULT_TEXT
		"status": (OK|ERROR)
	}

Requirements
------------

* `node.js <http://nodejs.org/>`_ v0.4.4
* `node-radability <https://github.com/arrix/node-readability>`_
