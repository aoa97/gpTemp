import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import firebase from './firebaseConfig'
import uuid from 'uuid';
console.disableYellowBox = true;

export async function _launchCameraRoll() {
    let { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    if (status !== 'granted') {
        console.error("Camera roll permission denied")
        return
    }
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 0.5
    })
    if (!result.cancelled) {
        return uploadImage(result.uri)
    }
}

export async function _takePhoto() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status !== 'granted') {
        console.error("Camera permission denied")
        return
    }
    let result = await ImagePicker.launchCameraAsync({
        quality: 0
    })
    if (!result.cancelled) {
        return uploadImage(result.uri)
    }
}


async function uploadImage(uri) {
    const response = await fetch(uri)
    const blob = await response.blob()
    var ref = firebase.storage().ref().child(`images/${uuid.v4()}`)
    const snap = await ref.put(blob)
    return await {
        url: snap.ref.getDownloadURL(),
        data: snap.ref.getMetadata()
    }
}
