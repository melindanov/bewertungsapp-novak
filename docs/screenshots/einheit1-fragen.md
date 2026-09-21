### 1. Unterschied zwischen Capacitor und Cordova

* Beide verbinden eine Web-App mit dem Smartphone.
* Capacitor ist neuer und wird von Ionic empfohlen.
* Cordova ist älter und verwendet ein ähnliches Prinzip.

### 2. Was macht Sequelize und wofür ist sequelize-cli?

* Sequelize ist ein ORM und verbindet JavaScript mit der MySQL-Datenbank.
* Man kann Datenbanken mit JavaScript-Objekten und Befehlen verwalten, statt direkt SQL zu schreiben.
* sequelize-cli hilft z.B. beim Erstellen von Migrationen, Models und Datenbanken.

### 3. Unterschied zwischen `npm install` und `npx`

* `npm install` installiert ein Paket bzw. eine Abhängigkeit.
* `npx` führt ein Paket bzw. dessen Befehle aus.
* Beispiel: `npx sequelize-cli init` führt die Sequelize-CLI aus, ohne dass man sie global installieren muss.

### 4. Was ist REST und warum passt es zu Client-Server?

* REST ist eine Art, wie Programme über HTTP miteinander kommunizieren.
* Das Frontend kann z.B. mit `GET`, `POST`, `PUT` und `DELETE` Daten vom Backend anfordern oder ändern (Wie das CRUD in DB).
* Das passt gut, weil Ionic/Angular der Client und Node/Express der Server ist.
