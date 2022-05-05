import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { socket } from "../App";
import useAuth from "./useAuthentication";
import useChat from "./useChat";

const useVideoCall = (myVideoRef, remoteVideoRef) => {
  const { activeConversation, setActiveVideoCall, activeVideoCall } = useChat();
  const { user } = useAuth();
  const userStream = useRef();
  const myPeerConnection = useRef();
  const canvasRef = useRef();
  const width = useRef(320);
  const height = useRef(null);
  const photoRef = useRef(null);
  const savePhotoRef = useRef(null);
  const [isCalling, setIsCalling] = useState(false);
  const [swap, setSwap] = useState(false);
  const [screenCaptured, setScreenCaptured] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState("");

  function createPeerConnection() {
    // Create an RTCPeerConnection which knows to use our chosen
    // STUN server.
    const iceConfig = {
      iceServers: [
          {
      urls: "stun:openrelay.metered.ca:80",
    },
    {
      urls: "turn:openrelay.metered.ca:80",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:openrelay.metered.ca:443",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:openrelay.metered.ca:443?transport=tcp",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
      ],
    };
    const peer = new RTCPeerConnection(iceConfig);
    // Set up event handlers for the ICE negotiation process.

    peer.onicecandidate = handleICECandidateEvent;
    peer.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
    peer.onicegatheringstatechange = handleICEGatheringStateChangeEvent;
    peer.onsignalingstatechange = handleSignalingStateChangeEvent;
    peer.onnegotiationneeded = handleNegotiationNeededEvent;
    peer.ontrack = handleTrackEvent;
    return peer;
  }

  async function startCall(type = "videoCall") {
    setIsCalling(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === "videoCall" ? true : false,
      });
      myVideoRef.current.srcObject = stream;
      userStream.current = stream;

      if (myPeerConnection.current) return;
      //send call request

      myPeerConnection.current = createPeerConnection();
      userStream.current
        .getTracks()
        .forEach((track) =>
          myPeerConnection.current.addTrack(track, userStream.current)
        );
    } catch (error) {
      if (error.name.includes("NotFound")) {
        toast.error(
          "Call initialization failed! No camera or microphone were found "
        );
        return endCall();
      }
      if (error.name.includes("Security")) {
        toast.error("Something went wrong");
        return endCall();
      }
      if (error.name.includes("Permission")) {
        return endCall();
      }
    }
  }

  async function handleNegotiationNeededEvent() {
    try {
      const offer = await myPeerConnection.current.createOffer();

      if (myPeerConnection.current.signalingState !== "stable") {
        return;
      }
      await myPeerConnection.current.setLocalDescription(offer);
      const offerData = {
        target: activeConversation.members.find((m) => m._id !== user._id)._id,
        caller: user._id,
        sdp: myPeerConnection.current.localDescription,
      };
      socket.emit("offer", offerData);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleReceiveCall(incomingCall) {
    setIsCalling(true);

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    myVideoRef.current.srcObject = stream;
    userStream.current = stream;
    myPeerConnection.current = createPeerConnection();
    setActiveVideoCall({
      participants: activeConversation.members.map((m) => m._id),
      iceConnectionState: myPeerConnection.current.iceConnectionState,
      signalingState: myPeerConnection.current.signalingState,
      iceGatheringState: myPeerConnection.current.iceGatheringState,
      connectionState: myPeerConnection.current.connectionState,
    });
    const description = new RTCSessionDescription(incomingCall.sdp);
    myPeerConnection.current
      .setRemoteDescription(description)
      .then(() => {
        userStream.current
          .getTracks()
          .forEach((track) =>
            myPeerConnection.current.addTrack(track, userStream.current)
          );
      })
      .then(() => myPeerConnection.current.createAnswer())
      .then((answer) => myPeerConnection.current.setLocalDescription(answer))
      .then(() => {
        const answerData = {
          target: incomingCall.caller,
          userId: user._id,
          sdp: myPeerConnection.current.localDescription,
        };
        socket.emit("answer", answerData);
      });
  }

  function handleAnswer(message) {
    setActiveVideoCall({
      participants: [message.target, message.userId],
      iceConnectionState: myPeerConnection.current.iceConnectionState,
      signalingState: myPeerConnection.current.signalingState,
      iceGatheringState: myPeerConnection.current.iceGatheringState,
      connectionState: myPeerConnection.current.connectionState,
    });
    const description = new RTCSessionDescription(message.sdp);
    myPeerConnection.current
      .setRemoteDescription(description)
      .catch((e) => console.log(e, "answer error"));
  }

  function handleICECandidateEvent(e) {
    if (e.candidate && activeConversation.id) {
      const data = {
        target: activeConversation.members.find((m) => m._id !== user._id)._id,
        candidate: e.candidate,
      };
      socket.emit("iceCandidate", data);
    }
  }

  function handleICEGatheringStateChangeEvent(event) {
    console.log(myPeerConnection.current.iceGatheringState);
  }
  function handleSignalingStateChangeEvent(event) {
    console.log(event);
  }

  function handleICEConnectionStateChangeEvent(e) {
    switch (myPeerConnection.current.iceConnectionState) {
      case "closed":
        endCall();
        break;
      case "failed":
        endCall();
        break;
      case "disconnected":
        endCall();
        break;
      default:
        return;
    }
  }

  function handleNewICECandidateMsg(incoming) {
    const candidate = new RTCIceCandidate(incoming);

    if (myPeerConnection.current) {
      myPeerConnection.current
        .addIceCandidate(candidate)
        .catch((e) => console.log(e, " error"));
    }
  }

  function handleTrackEvent(e) {
    if (remoteVideoRef.current.srcObject) return;
    remoteVideoRef.current.srcObject = e.streams[0];
  }

  //hang up --------------------------------------------------------------------------
  function endCall() {
    setIsCalling(false);
    if (myPeerConnection.current) {
      myPeerConnection.current.ontrack = null;
      myPeerConnection.current.onnicecandidate = null;
      myPeerConnection.current.oniceconnectionstatechange = null;
      myPeerConnection.current.onsignalingstatechange = null;
      myPeerConnection.current.onicegatheringstatechange = null;
      myPeerConnection.current.onnotificationneeded = null;

      myPeerConnection.current.getTransceivers().forEach((transceiver) => {
        transceiver.stop();
      });
      if (myVideoRef.current?.srcObject) {
        myVideoRef.current.pause();
        myVideoRef.current.srcObject.getTracks().forEach((track) => {
          track.stop();
        });
      }
      if (remoteVideoRef.current?.srcObject) {
        remoteVideoRef.current.pause();
        remoteVideoRef.current.srcObject.getTracks().forEach((track) => {
          track.stop();
        });
      }
      myPeerConnection.current.close();
      myPeerConnection.current = null;
      userStream.current = null;

      myVideoRef.current.removeAttribute("src");
      myVideoRef.current.removeAttribute("srcObject");
      remoteVideoRef.current.removeAttribute("src");
      remoteVideoRef.current.removeAttribute("srcObject");

      const payload = {
        target: [
          ...activeVideoCall.participants.filter(
            (userId) => userId !== user._id
          ),
        ],
        personEndingTheCall: user._id,
      };
      socket.emit("connection-ended", payload);
    }
  }

  //take a screen shot--------------------------------------------------------------------------
  function screenShot() {
    setScreenCaptured(true);
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (width.current && height.current) {
        canvasRef.current.width = width.current;
        canvasRef.current.height = height.current;
        context.drawImage(
          remoteVideoRef.current,
          0,
          0,
          width.current,
          height.current
        );
        const data = canvasRef.current.toDataURL("image/png");
        photoRef.current.setAttribute("src", data);
        photoRef.current.setAttribute("src", data);
        savePhotoRef.current.setAttribute("href", data);
      }
    }
  }

  function screenShotSettings() {
    height.current =
      remoteVideoRef.current.videoHeight /
      (remoteVideoRef.current.videoWidth / 320);
    remoteVideoRef.current.setAttribute("width", 320);
    remoteVideoRef.current.setAttribute("height", height);
    canvasRef.current.setAttribute("width", 320);
    canvasRef.current.setAttribute("height", height);
  }

  //swap video--------------------------------------------------------------------------
  useEffect(() => {
    let swapObj = {};
    if (
      myPeerConnection.current &&
      myVideoRef.current &&
      remoteVideoRef.current
    ) {
      swapObj = remoteVideoRef.current.srcObject;
      remoteVideoRef.current.srcObject = myVideoRef.current.srcObject;
      myVideoRef.current.srcObject = swapObj;
    }
  }, [swap, myVideoRef, remoteVideoRef]);

  useEffect(() => {
    socket.off("offer").on("offer", handleReceiveCall);

    socket.off("answer").on("answer", handleAnswer);

    socket.off("ice-candidate").on("ice-candidate", handleNewICECandidateMsg);

    socket
      .off("connection-ended")
      .on("connection-ended", handleNewICECandidateMsg);
    socket.off("call-ended").on("call-ended", () => endCall);
  });
  function toggleSwap() {
    setSwap(!swap);
  }
  return {
    startCall,
    endCall,
    toggleSwap,
    isCalling,
  };
};

export default useVideoCall;
