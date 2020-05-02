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
    }

    async getMedia(videoTag) {
        try {
            // Obtengo la camara
            cameraDevice = await navigator.mediaDevices.getUserMedia(this.constraints);
            // Inserto la camara en el tag VIDEO.
            videoTag.srcObject = cameraDevice;
            videoTag.play();

            // Seteo mi objeto
            this.globalRTCRecorder = RecordRTC(cameraDevice, {
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
            console.error('ERROR: ', error);
        }
    }

    comenzarGrabacion() {
        globalRTCRecorder.startRecording();
    }

    detenerGrabacion() {
        globalRTCRecorder.stopRecording(async function() {
            let blob = await globalRTCRecorder.getBlob();
            console.log(blob);
        });
    }
}