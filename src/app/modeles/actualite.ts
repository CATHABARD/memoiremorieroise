export class Actualite {
    constructor(
        public id?: string,
        public date?: string,
        public titre?: string,
        public sousTitre?: string,
        public texte?: string,
        public photo?: string,
        public auteur?: string,
        public nomAuteur?: string,
        public status?: number) { }
}
