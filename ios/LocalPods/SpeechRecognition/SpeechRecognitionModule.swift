import Foundation
import Speech
import AVFoundation
import React

@objc(SpeechRecognitionModule)
class SpeechRecognitionModule: RCTEventEmitter {
  
  private var speechRecognizer: SFSpeechRecognizer?
  private var recognitionTask: SFSpeechRecognitionTask?
  private var audioEngine: AVAudioEngine?
  
  override static func moduleName() -> String! {
    return "SpeechRecognitionModule"
  }
  
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  override func supportedEvents() -> [String]! {
    return ["onSpeechResult"]
  }
  
  @objc func requestAuth(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    SFSpeechRecognizer.requestAuthorization { status in
      switch status {
      case .authorized:
        resolve(["authorized"])
      case .denied, .restricted, .notDetermined:
        resolve(["denied"])
      @unknown default:
        resolve(["denied"])
      }
    }
  }
  
  @objc func startListening(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    speechRecognizer = SFSpeechRecognizer(locale: Locale(identifier: "zh-CN"))
    
    guard let speechRecognizer = speechRecognizer, speechRecognizer.isAvailable else {
      reject("ERROR", "Speech recognizer not available", nil)
      return
    }
    
    stopListening()
    
    do {
      let audioSession = AVAudioSession.sharedInstance()
      try audioSession.setCategory(.record, mode: .measurement, options: .duckOthers)
      try audioSession.setActive(true, options: .notifyOthersOnDeactivation)
    } catch {
      reject("ERROR", "Failed to configure audio session: \(error.localizedDescription)", nil)
      return
    }
    
    // iOS: 使用 SFSpeechAudioBufferRecognitionRequest
    let recognitionRequest = SFSpeechAudioBufferRecognitionRequest()
    recognitionRequest.shouldReportPartialResults = true
    recognitionRequest.requiresOnDeviceRecognition = false
    
    audioEngine = AVAudioEngine()
    guard let audioEngine = audioEngine else {
      reject("ERROR", "Unable to create audio engine", nil)
      return
    }
    
    let inputNode = audioEngine.inputNode
    let recordingFormat = inputNode.outputFormat(forBus: 0)
    
    inputNode.installTap(onBus: 0, bufferSize: 1024, format: recordingFormat) { buffer, _ in
      recognitionRequest.append(buffer)
    }
    
    recognitionTask = speechRecognizer.recognitionTask(with: recognitionRequest) { [weak self] result, error in
      if let error = error {
        reject("ERROR", error.localizedDescription, nil)
        return
      }
      
      if let result = result {
        let text = result.bestTranscription.formattedString
        self?.sendEvent(withName: "onSpeechResult", body: ["text": text, "isFinal": result.isFinal])
        
        if result.isFinal {
          self?.stopListening()
        }
      }
    }
    
    audioEngine.prepare()
    do {
      try audioEngine.start()
      resolve(["started"])
    } catch {
      reject("ERROR", "Failed to start audio engine: \(error.localizedDescription)", nil)
    }
  }
  
  @objc func stopListening() {
    audioEngine?.stop()
    audioEngine?.inputNode.removeTap(onBus: 0)
    recognitionTask?.cancel()
    recognitionTask = nil
  }
}