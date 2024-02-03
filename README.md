## Design

Il design si trova alla [seguente pagina di Figma](https://www.figma.com/file/z20ijkrrDMdTq1cQfGCQi5/Rick-and-Morty---The-Wave-Project?type=design&node-id=1601-7025&t=Oraety29FoXaZV5M-0).
Ti aiuterà a definire struttura e modello dei dati su cui lavorare.

## Obiettivi del test

I requisiti del test sono divisi in "**mandatory**" (ovvero quello che ci si aspetta per raggiungere la definition of done del test) e "**nice to have**" (bonus nel caso si finisca prima del previsto).
L'obbiettivo è costruire un backend server che supporti lo sviluppo front-end della web application disegnata su Figma.

#### Mandatory

- Costruire i modelli dati delle entità "**Personaggio**", "**Episodio**" e "**Location**" della serie.
- Sviluppare tutti gli endpoint necessari al CRUD di un personaggio.
- Ogni personaggio avrà relazioni "**1 a N**" o "**N a N**" con le entità "**Episodes**" e "**Location**"
- Creare due GET che dato in ingresso l'id di un episodio o di una location tornino in output la lista di tutti i personaggi relazionati (Es: https://rickandmortyapi.com/api/location/34, https://rickandmortyapi.com/api/episode/10)
- Come si evince dal Figma sarà possibile filtrare i personaggi per diversi parametri, costruire le API necessarie allo sviluppo di questa feature.
- Unit Test per il 50% degli endpoint.

#### Nice to have

- Chiara divisione dei componenti e del codice riutilizzabile, utilizzando una folder structure leggibile.
- Logica di paginazione per tutte le GET.
- Utilizzo di GraphQL.
- Documentazione tramite swagger del 40% degli endpoint.
- Utilizzo di Docker e Container per app e Database.

## Note

- Non avendo accesso ai dati sui personaggi originali della serie sarà possibile utilizzare una libreria come faker(https://fakerjs.dev/) o utilizzare un dataset molto ridotto (5 personaggi, 4 location, 4 Episodi)
- Sarebbe opportuno utilizzare TypeScript.
- Sarebbe opportuno effettuare vari commit ogni volta che si lavora ad una feature, utilizzando i conventional commits.

## Test

- Test commit iniziale Marco Montepeloso

## Deployment

- Deployed @ [Railway](https://the-wave-test-demo-production.up.railway.ap)
