```
npx sequelize-cli model:generate --name Team --attributes name:string,klasse:string

npx sequelize-cli model:generate --name Member --attributes teamId:integer,vorname:string,nachname:string

npx sequelize-cli model:generate --name Project --attributes teamId:integer,titel:string,beschreibung:text,praesentiertAm:date

npx sequelize-cli model:generate --name Criterion --attributes name:string,maxScore:integer,weight:float

npx sequelize-cli model:generate --name Juror --attributes name:string,email:string

npx sequelize-cli model:generate --name Evaluation --attributes projectId:integer,criterionId:integer,jurorId:integer,score:integer,comment:text
```