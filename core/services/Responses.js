export class OfflineResponse {
    constructor({ data = {}, status = 200 }) {
        this.data = data;
        this.status = status;
    }
}

export class OfflineNotFound extends OfflineResponse {
    constructor(message = "") {
        super({
            status: 404,
        });
    }
}

export class OfflineBadRequest extends OfflineResponse {
    constructor(message = "") {
        super({
            status: 400,
        });
    }
}
