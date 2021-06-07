<script>
export default {
    model: {
        props: "action",
        event: "change",
    },
    props: {
        action: Object,
        requiredField: {
            type: Array,
        },
    },
    data() {
        return {
            actionData: null,
            datePickerEvent: false,
            datePickerEvent2: false,
            timePickerEvent: false,
            timePickerEvent2: false,

            tags: {},
            rappelDefault: ["H-1", "H-2", "H-3", "H-4", "D-1", "D-2", "D-3"],
            city: [],
        };
    },
    methods: {
        setSubscribers(subscribers) {
            this.actionData.subsLink = Object.values(subscribers);
            this.actionData.subs_linked = Object.values(subscribers);
        },
        async searchCity(event) {
            delete this.$axios.defaults.headers.common["Authorization"];
            if (event.target.value.length > 2) {
                let resp = await this.$axios.request(
                    "https://data.enseignementsup-recherche.gouv.fr/api/records/1.0/search/?dataset=fr-esr-referentiel-geographique&q=" +
                        event.target.value +
                        "&lang=fr&rows=10",
                    {
                        headers: {
                            Authorization: null,
                        },
                    },
                );
                this.city = [];
                for (let city of resp.data.records) {
                    this.city.push(city.fields.com_nom);
                }
            }
        },
    },
    computed: {
        subscribers() {
            let subscibers = {};
            let subsLink = {};
            // this.actionData?.subsLink => if this.actionData is true, take this.actionData.subsLink
            subsLink = { ...this.actionData?.subsLink, ...this.actionData?.subs_linked };

            for (let sub of Object.values(subsLink)) {
                subscibers[sub.id] = sub;
            }

            return subscibers;
        },
    },
    watch: {
        actionData(val) {
            this.$emit("change", val);
        },
        action: {
            handler: function(val) {
                let user = this.$store.state.app.user;
                const actionDataDefault = {
                    name: "",
                    date: "",
                    info: {
                        color: "color1",
                        comment: val.type === 0 || val.type === 3 ? [{ author: user, message: "" }] : "",
                        date: "",
                        dateBegin: "",
                        dateEnd: "",
                        jobDate: "",
                        localization: "",
                        rappel: "",
                        time: "",
                        timeBegin: "",
                        timeEnd: "",
                    },
                    tags: null,
                    subsLink: [],
                };
                this.actionData = { ...actionDataDefault, ...val };
            },
            immediate: true,
        },
    },
};
</script>

<i18n>
    {
        "en": {
            "title": "Note Title",
            "message": "Note Content",
            "contact-asso": "Associated contact",
            "tag-asso": "Associated TAG",
            "save": "Save note",
            "cancel": "Cancel",
            "save-message": "Note saved",
            "empty": "At least one field is empty."
        },
        "fr": {
            "title": "Saisir un titre pour votre note",
            "message": "Saisir votre message",
            "contact-asso": "Contact(s) associé(s)",
            "tag-asso": "TAG(s) associé(s)",
            "save": "Enregistrer une note",
            "cancel": "Ignorer",
            "save-message": "Votre note a bien été enregistrée.",
            "empty": "Un des champs est vide"
        }
    }
</i18n>
