Pod::Spec.new do |s|
  s.name         = "SpeechRecognition"
  s.version      = "1.0"
  s.summary      = "Speech recognition for PoetryMasterApp"
  s.description  = "Native iOS speech recognition module using Speech framework"
  s.homepage     = "https://github.com/lshgdut/PoetryMasterApp"
  s.license      = "MIT"
  s.author       = { "hua" => "lshgdut@qq.com" }
  s.platform     = :ios, "15.0"
  s.source       = { :path => "." }
  s.source_files = "*.{h,m,swift}"
  s.dependency   "React-Core"
  s.swift_version = "5.0"
end