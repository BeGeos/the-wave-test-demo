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

## Local development

Per lo sviluppo in locale del progetto

1. copiare la repo localmente

```bash
git pull [origin-della-repo]
```

2. Costruire il container su Dockerfile. Nella root del progetto

```bash
docker build
```

3. Una volta terminato il processo di build avviare i container tramite `docker-compose`. Assicurarsi di averlo installato sul proprio computer. Oppure visita la [pagina](https://docs.docker.com/compose/install/).
   Il file crea 2 immagini - una per il database postgres e una per i file del progetto. Nel caso ci siano problemi con i volumi dedicati come `naming conflicts` etc, modificare il `docker-compose.yml` file nella root del progetto

```bash
docker-compose up -d
```

oppure

```bash
# Questo avvia il processo e mostra direttamente sul terminale invece che avviarlo in background daemon o sub-process

docker-compose up
```

4. Se tutto il processo e' andato a buon fine i container dovrebbero mostrare una attivita' e visitando `https://localhost:3000/pulse` si dovrebbe vedere un bel 💗

5. Per eseguire i test

```bash
pnpm test
# or
pnpm test:watch  # questo setta vitest in watch mode - rerun ad ogni cambiamento
```

6. Per visitare al documentazione riguardo gli endpoint visitare la risorsa a `/docs`. I docs sono gestiti da [Swagger](https://swagger.io/docs/). Per aggiungere o modificare la documentazione bisogna modificare il file nella root del progetto `swagger.yaml`.
   Siccome il file non e' monitorato da tsc ad ogni cambiamento bisogna riavviare il server per poterlo vedere all'indirizzo della risorsa.
