/**
 * @file VoiceDispatch.tsx
 * @description 语音调度组件
 * @provides 语音通话、语音消息、录音功能等
 */

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Users, 
  Volume2,
  VolumeX,
  Radio,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  Speaker,
  Headphones,
  Wifi,
  WifiOff,
  Square
} from "lucide-react";
import type { Vehicle } from "../types/dispatch";

// ==================== Props接口 ====================

interface VoiceDispatchProps {
  /** 选中的车辆ID列表 */
  selectedVehicleIds: string[];
  /** 车辆列表 */
  vehicles: Vehicle[];
  /** 开始语音通话回调 */
  onStartVoiceCall: (vehicleIds: string[]) => void;
  /** 结束语音通话回调 */
  onEndVoiceCall: (callId: string) => void;
  /** 发送语音消息回调 */
  onSendVoiceMessage: (vehicleIds: string[], audioBlob: Blob) => void;
}

// ==================== 子组件 ====================

/**
 * 通话状态指示器组件
 */
function CallStatusIndicator({ 
  status, 
  duration 
}: { 
  status: "connecting" | "active" | "ended"; 
  duration: number; 
}) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusConfig = () => {
    switch (status) {
      case "connecting":
        return { color: "text-orange-600", bg: "bg-orange-100", label: "连接中" };
      case "active":
        return { color: "text-green-600", bg: "bg-green-100", label: "通话中" };
      case "ended":
        return { color: "text-gray-600", bg: "bg-gray-100", label: "已结束" };
      default:
        return { color: "text-gray-600", bg: "bg-gray-100", label: "未知" };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${config.bg}`}>
      <div className={`w-2 h-2 rounded-full ${
        status === "connecting" ? "bg-orange-500 animate-pulse" :
        status === "active" ? "bg-green-500 animate-pulse" :
        "bg-gray-500"
      }`} />
      <span className={`text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
      {status === "active" && (
        <span className={`text-sm ${config.color}`}>
          {formatDuration(duration)}
        </span>
      )}
    </div>
  );
}

/**
 * 参与者列表组件
 */
function ParticipantsList({ 
  participants, 
  vehicles 
}: { 
  participants: string[]; 
  vehicles: Vehicle[]; 
}) {
  const participantVehicles = vehicles.filter(v => participants.includes(v.id));

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm">参与者 ({participants.length})</h4>
      <div className="space-y-1">
        {participantVehicles.map(vehicle => (
          <div key={vehicle.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Phone className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-sm">{vehicle.plateNumber}</div>
                <div className="text-xs text-gray-500">{vehicle.driver.name}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600">在线</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 录音控制组件
 */
function RecordingControl({ 
  isRecording, 
  onStartRecording, 
  onStopRecording 
}: {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
        isRecording 
          ? "bg-red-500 animate-pulse" 
          : "bg-gray-200 hover:bg-gray-300"
      }`}>
        <Button
          size="lg"
          className={`w-full h-full rounded-full ${
            isRecording 
              ? "bg-red-500 hover:bg-red-600" 
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={isRecording ? onStopRecording : onStartRecording}
        >
          {isRecording ? (
            <Square className="h-8 w-8 text-white" />
          ) : (
            <Mic className="h-8 w-8 text-gray-600" />
          )}
        </Button>
        {isRecording && (
          <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"></div>
        )}
      </div>
      
      <div className="text-center">
        <p className="text-sm font-medium">
          {isRecording ? "正在录音..." : "按住说话"}
        </p>
        {isRecording && (
          <p className="text-xs text-gray-500">松开结束录音</p>
        )}
      </div>
    </div>
  );
}

/**
 * 音频设置组件
 */
function AudioSettings({ 
  isMuted, 
  isSpeakerOn, 
  onToggleMute, 
  onToggleSpeaker 
}: {
  isMuted: boolean;
  isSpeakerOn: boolean;
  onToggleMute: () => void;
  onToggleSpeaker: () => void;
}) {
  return (
    <div className="flex items-center justify-around p-4 bg-gray-50 rounded-lg">
      <Button
        variant={isMuted ? "outline" : "default"}
        size="sm"
        onClick={onToggleMute}
        className="flex items-center space-x-2"
      >
        {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        <span>{isMuted ? "取消静音" : "静音"}</span>
      </Button>
      
      <Button
        variant={isSpeakerOn ? "default" : "outline"}
        size="sm"
        onClick={onToggleSpeaker}
        className="flex items-center space-x-2"
      >
        <Speaker className="h-4 w-4" />
        <span>{isSpeakerOn ? "扬声器" : "听筒"}</span>
      </Button>
    </div>
  );
}

/**
 * 连接状态指示器组件
 */
function ConnectionStatus({ isConnected }: { isConnected: boolean }) {
  return (
    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
      isConnected ? "bg-green-100" : "bg-red-100"
    }`}>
      {isConnected ? (
        <Wifi className="h-4 w-4 text-green-600" />
      ) : (
        <WifiOff className="h-4 w-4 text-red-600" />
      )}
      <span className={`text-sm font-medium ${
        isConnected ? "text-green-600" : "text-red-600"
      }`}>
        {isConnected ? "已连接" : "连接断开"}
      </span>
    </div>
  );
}

// ==================== 主组件 ====================

/**
 * 语音调度组件
 */
export function VoiceDispatch({
  selectedVehicleIds,
  vehicles,
  onStartVoiceCall,
  onEndVoiceCall,
  onSendVoiceMessage,
}: VoiceDispatchProps) {
  const [isInCall, setIsInCall] = useState(false);
  const [callStatus, setCallStatus] = useState<"connecting" | "active" | "ended">("ended");
  const [callDuration, setCallDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 通话计时器
  useEffect(() => {
    if (callStatus === "active") {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    }
    
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [callStatus]);

  // 开始语音通话
  const handleStartVoiceCall = async () => {
    if (selectedVehicleIds.length === 0) {
      alert("请先选择要呼叫的车辆");
      return;
    }

    setIsInCall(true);
    setCallStatus("connecting");
    setCallDuration(0);

    try {
      // 模拟连接过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCallStatus("active");
      onStartVoiceCall(selectedVehicleIds);
    } catch (error) {
      console.error("Failed to start voice call:", error);
      setCallStatus("ended");
      setIsInCall(false);
    }
  };

  // 结束语音通话
  const handleEndVoiceCall = () => {
    setCallStatus("ended");
    setIsInCall(false);
    setCallDuration(0);
    
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }
  };

  // 开始录音
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        onSendVoiceMessage(selectedVehicleIds, audioBlob);
        audioChunksRef.current = [];
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert("无法访问麦克风，请检查权限设置");
    }
  };

  // 停止录音
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  // 切换静音
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  // 切换扬声器
  const handleToggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  const selectedVehicles = vehicles.filter(v => selectedVehicleIds.includes(v.id));

  return (
    <div className="space-y-4">
      {/* 标题和状态 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Radio className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">语音调度</CardTitle>
              {isInCall && (
                <CallStatusIndicator status={callStatus} duration={callDuration} />
              )}
            </div>
            <ConnectionStatus isConnected={isConnected} />
          </div>
        </CardHeader>
      </Card>

      {/* 选中的车辆 */}
      {selectedVehicleIds.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <ParticipantsList 
              participants={selectedVehicleIds} 
              vehicles={vehicles} 
            />
          </CardContent>
        </Card>
      )}

      {/* 通话控制 */}
      {!isInCall ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold mb-2">开始语音通话</h3>
                <p className="text-sm text-gray-600 mb-4">
                  与选中的 {selectedVehicleIds.length} 辆车进行语音通话
                </p>
              </div>
              
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={handleStartVoiceCall}
                  disabled={selectedVehicleIds.length === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  开始通话
                </Button>
              </div>

              {selectedVehicleIds.length === 0 && (
                <div className="text-center text-sm text-gray-500">
                  请先选择要呼叫的车辆
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* 通话中界面 */}
              <div className="text-center">
                <h3 className="font-semibold mb-2">语音通话中</h3>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{selectedVehicleIds.length} 人</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, "0")}</span>
                  </div>
                </div>
              </div>

              {/* 音频设置 */}
              <AudioSettings
                isMuted={isMuted}
                isSpeakerOn={isSpeakerOn}
                onToggleMute={handleToggleMute}
                onToggleSpeaker={handleToggleSpeaker}
              />

              {/* 结束通话按钮 */}
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={handleEndVoiceCall}
                  variant="destructive"
                >
                  <PhoneOff className="h-5 w-5 mr-2" />
                  结束通话
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 语音消息 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Mic className="h-4 w-4 text-gray-500" />
            <CardTitle className="text-base">语音消息</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <RecordingControl
              isRecording={isRecording}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
            />
            
            <div className="text-center text-xs text-gray-500">
              {selectedVehicleIds.length > 0 
                ? `将发送语音消息给 ${selectedVehicleIds.length} 辆车`
                : "请先选择要发送消息的车辆"
              }
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 使用说明 */}
      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Settings className="h-4 w-4 text-gray-500" />
            <h4 className="font-semibold text-sm">使用说明</h4>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <p>• 语音通话：与选中车辆进行实时语音通话</p>
            <p>• 语音消息：录制语音消息发送给选中车辆</p>
            <p>• 支持最多同时与8辆车进行语音通话</p>
            <p>• 语音消息最长支持60秒</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
