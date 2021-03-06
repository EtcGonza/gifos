class RtcRecorder {

    constructor() {
        this.constraints = {
            audio: false,
            video: {
                width: 1280,
                height: 720,
                facingMode: "user",
            }
        };

        this.globalRTCRecorder = null;
        this.camaraUser = null;
        this.miBlob = null;
    }

    async getMedia(videoTag) {
        try {
            // Obtengo la camara
            this.camaraUser = await navigator.mediaDevices.getUserMedia(this.constraints);
            // Inserto la camara en el tag VIDEO.
            videoTag.srcObject = this.camaraUser;
            videoTag.play();

            // Seteo mi objeto
            this.globalRTCRecorder = RecordRTC(this.camaraUser, {
                type: 'gif',
                frameRate: 1,
                quality: 10,
                // width: 360,
                hidden: 240,
                onGifRecordingStarted: function() {
                    console.log('Comence a grabar');
                },
            });

        } catch (error) {
            console.error('ERRORCIRIJILLO: ', error);
        }
    }

    comenzarGrabacion() {
        this.globalRTCRecorder.startRecording();
    }

    detenerGrabacion() {
        this.globalRTCRecorder.stopRecording(() => {
            this.miBlob = this.globalRTCRecorder.getBlob();
        });
    }

    getRecorderState() {
        return this.globalRTCRecorder.state;
    }

    destruirGrabacion() {
        this.globalRTCRecorder.reset();
    }

    getMiBlob() {
        return this.miBlob;
    }

    getUrlBlob() {
        return URL.createObjectURL(this.miBlob);
    }
}