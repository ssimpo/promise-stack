A Q promise module for stacking promises.  Each instance of the the stack returns a promise, which is only fulfilled when every promise in the stack is resolved.  Different to Q.all() in that new promises can be added asynchronously after initialisation.

Uses the Q promise module.