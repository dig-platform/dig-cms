Dig Data Sources
================

Dig data sources handle reading and writing the data that we use.

DigLocalData
------------

DigLocalData is the core data source and is included for testing. It stores any data you read or write
in local storage.

DigNgrxData
----------------

> TODO this adapter will connect the Dig data to the app's Ngrx store.

DigFirestoreData
----------------

> TODO this adapter will connect the Dig data to the Google Firebase Firestore database

Creating your own data sources
------------------------------

All data sources must implement the `DigDataSource` interface.
