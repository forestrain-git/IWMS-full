/**
 * @file VideoConference.tsx
 * @description 视频会商组件
 * @provides 视频会议、屏幕共享、参会者管理等功能
 */

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  MonitorOff,
  Users, 
  Phone, 
  PhoneOff,
  Settings,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
  Clock,
  MessageSquare,
  Share,
  Eye,
  EyeOff,
  Camera,
  CameraOff
} from "lucide-react";
import type { Vehicle, VideoConferenceState } from "../types/dispatch";

// ==================== Props接口 ====================

interface VideoConferenceProps {
  /** 选中的车辆ID列表 */
  selectedVehicleIds: string[];
  /** 车辆列表 */
  vehicles: Vehicle[];
  /** 开始视频会议回调 */
  onStartConference: (vehicleIds: string[]) => void;
  /** 结束视频会议回调 */
  onEndConference: (conferenceId: string) => void;
  /** 会议状态 */
  conferenceState?: VideoConferenceState | null;
}

// ==================== 子组件 ====================

/**
 * 参会者视频组件
 */
function ParticipantVideo({ 
  participant, 
  isLocal, 
  isMuted, 
  isVideoOff 
}: { 
  participant: any;
  isLocal: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
}) {
  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
      {/* 视频占位符 */}
      {isVideoOff ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <CameraOff className="h-12 w-12 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">
              {isLocal ? "您的摄像头已关闭" : `${participant.userName}的摄像头已关闭`}
            </p>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
          <div className="text-white text-center">
            <Users className="h-12 w-12 mx-auto mb-2" />
            <p className="text-sm">{participant.userName}</p>
          </div>
        </div>
      )}

      {/* 控制覆盖层 */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isMuted && (
            <div className="bg-red-500 rounded-full p-1">
              <MicOff className="h-3 w-3 text-white" />
            </div>
          )}
          {isVideoOff && (
            <div className="bg-gray-500 rounded-full p-1">
              <CameraOff className="h-3 w-3 text-white" />
            </div>
          )}
        </div>
        <Badge className="bg-black bg-opacity-50 text-white text-xs">
          {participant.userName}
        </Badge>
      </div>

      {/* 本地用户标识 */}
      {isLocal && (
        <div className="absolute top-2 left-2">
          <Badge className="bg-blue-500 text-white text-xs">您</Badge>
        </div>
      )}
    </div>
  );
}

/**
 * 会议控制栏组件
 */
function ConferenceControls({
  isMuted,
  isVideoOff,
  isScreenSharing,
  isSpeakerOn,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onToggleSpeaker,
  onEndCall,
}: {
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  isSpeakerOn: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onToggleSpeaker: () => void;
  onEndCall: () => void;
}) {
  return (
    <div className="flex items-center justify-center space-x-4 p-4 bg-gray-900 rounded-lg">
      <Button
        variant={isMuted ? "destructive" : "secondary"}
        size="sm"
        onClick={onToggleMute}
        className="rounded-full w-12 h-12"
      >
        {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </Button>
      
      <Button
        variant={isVideoOff ? "destructive" : "secondary"}
        size="sm"
        onClick={onToggleVideo}
        className="rounded-full w-12 h-12"
      >
        {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
      </Button>
      
      <Button
        variant={isScreenSharing ? "default" : "secondary"}
        size="sm"
        onClick={onToggleScreenShare}
        className="rounded-full w-12 h-12"
      >
        {isScreenSharing ? <Monitor className="h-5 w-5" /> : <MonitorOff className="h-5 w-5" />}
      </Button>
      
      <Button
        variant="destructive"
        size="sm"
        onClick={onEndCall}
        className="rounded-full w-12 h-12"
      >
        <PhoneOff className="h-5 w-5" />
      </Button>
    </div>
  );
}

/**
 * 参会者列表组件
 */
function ParticipantsList({ 
  participants, 
  vehicles 
}: { 
  participants: any[]; 
  vehicles: Vehicle[]; 
}) {
  const getVehicleInfo = (userId: string) => {
    return vehicles.find(v => v.driver.id === userId);
  };

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm">参会者 ({participants.length})</h4>
      <div className="space-y-1">
        {participants.map(participant => {
          const vehicle = getVehicleInfo(participant.userId);
          return (
            <div key={participant.userId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  participant.isVideoOn ? "bg-green-100" : "bg-gray-200"
                }`}>
                  {participant.isVideoOn ? (
                    <Video className="h-4 w-4 text-green-600" />
                  ) : (
                    <VideoOff className="h-4 w-4 text-gray-500" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-sm">{participant.userName}</div>
                  {vehicle && (
                    <div className="text-xs text-gray-500">{vehicle.plateNumber}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {participant.isMuted ? (
                  <MicOff className="h-3 w-3 text-red-500" />
                ) : (
                  <Mic className="h-3 w-3 text-green-500" />
                )}
                <div className={`w-2 h-2 rounded-full ${
                  participant.isConnected ? "bg-green-500" : "bg-red-500"
                }`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 会议信息组件
 */
function ConferenceInfo({ 
  conference, 
  duration 
}: { 
  conference: VideoConferenceState; 
  duration: number; 
}) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">会议信息</h4>
        <Badge className="bg-green-100 text-green-800">
          进行中
        </Badge>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">会议主题:</span>
          <span className="font-medium">{conference.topic}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">开始时间:</span>
          <span>{new Date(conference.startTime).toLocaleTimeString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">会议时长:</span>
          <span className="font-medium">{formatDuration(duration)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">参会人数:</span>
          <span>{conference.participants.length}人</span>
        </div>
      </div>
    </div>
  );
}

// ==================== 主组件 ====================

/**
 * 视频会商组件
 */
export function VideoConference({
  selectedVehicleIds,
  vehicles,
  onStartConference,
  onEndConference,
  conferenceState,
}: VideoConferenceProps) {
  const [isInConference, setIsInConference] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [conferenceDuration, setConferenceDuration] = useState(0);
  
  const conferenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 会议计时器
  useEffect(() => {
    if (isInConference && conferenceState?.status === "active") {
      conferenceTimerRef.current = setInterval(() => {
        setConferenceDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (conferenceTimerRef.current) {
        clearInterval(conferenceTimerRef.current);
      }
    }
    
    return () => {
      if (conferenceTimerRef.current) {
        clearInterval(conferenceTimerRef.current);
      }
    };
  }, [isInConference, conferenceState?.status]);

  // 开始视频会议
  const handleStartConference = async () => {
    if (selectedVehicleIds.length === 0) {
      alert("请先选择要邀请的车辆");
      return;
    }

    if (selectedVehicleIds.length > 4) {
      alert("视频会议最多支持4人同时参与");
      return;
    }

    try {
      // 模拟开始会议
      setIsInConference(true);
      setConferenceDuration(0);
      onStartConference(selectedVehicleIds);
    } catch (error) {
      console.error("Failed to start conference:", error);
      setIsInConference(false);
    }
  };

  // 结束视频会议
  const handleEndConference = () => {
    setIsInConference(false);
    setConferenceDuration(0);
    
    if (conferenceTimerRef.current) {
      clearInterval(conferenceTimerRef.current);
    }
    
    if (conferenceState) {
      onEndConference(conferenceState.conferenceId);
    }
  };

  // 切换静音
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  // 切换视频
  const handleToggleVideo = () => {
    setIsVideoOff(!isVideoOff);
  };

  // 切换屏幕共享
  const handleToggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  // 切换全屏
  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const selectedVehicles = vehicles.filter(v => selectedVehicleIds.includes(v.id));

  // 模拟参会者数据
  const mockParticipants = [
    {
      userId: "local",
      userName: "调度员",
      isVideoOn: !isVideoOff,
      isMuted: isMuted,
      isConnected: true,
    },
    ...selectedVehicles.slice(0, 3).map(vehicle => ({
      userId: vehicle.driver.id,
      userName: vehicle.driver.name,
      isVideoOn: true,
      isMuted: false,
      isConnected: true,
    })),
  ];

  return (
    <div className={`space-y-4 ${isFullscreen ? "fixed inset-0 z-50 bg-black" : ""}`}>
      {/* 标题和状态 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Video className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">视频会商</CardTitle>
              {isInConference && (
                <Badge className="bg-green-100 text-green-800">
                  会议中 {Math.floor(conferenceDuration / 60)}:{(conferenceDuration % 60).toString().padStart(2, "0")}
                </Badge>
              )}
            </div>
            {isInConference && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleToggleFullscreen}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {!isInConference ? (
        // 会议前界面
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold mb-2">开始视频会商</h3>
                <p className="text-sm text-gray-600 mb-4">
                  与选中的驾驶员进行视频会议
                </p>
              </div>
              
              {/* 选中的车辆 */}
              {selectedVehicleIds.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">邀请的参与者:</h4>
                  <div className="space-y-1">
                    {selectedVehicles.map(vehicle => (
                      <div key={vehicle.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{vehicle.driver.name}</span>
                        <span className="text-xs text-gray-500">({vehicle.plateNumber})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={handleStartConference}
                  disabled={selectedVehicleIds.length === 0 || selectedVehicleIds.length > 4}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Video className="h-5 w-5 mr-2" />
                  开始会议
                </Button>
              </div>

              {selectedVehicleIds.length === 0 && (
                <div className="text-center text-sm text-gray-500">
                  请先选择要邀请的车辆（最多4辆）
                </div>
              )}
              
              {selectedVehicleIds.length > 4 && (
                <div className="text-center text-sm text-orange-500">
                  视频会议最多支持4人同时参与
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        // 会议中界面
        <div className={`space-y-4 ${isFullscreen ? "h-full flex flex-col" : ""}`}>
          {/* 视频网格 */}
          <div className={`grid grid-cols-2 gap-4 ${isFullscreen ? "flex-1" : ""}`}>
            {mockParticipants.map((participant, index) => (
              <ParticipantVideo
                key={participant.userId}
                participant={participant}
                isLocal={participant.userId === "local"}
                isMuted={participant.isMuted}
                isVideoOff={!participant.isVideoOn}
              />
            ))}
          </div>

          {/* 会议控制 */}
          <ConferenceControls
            isMuted={isMuted}
            isVideoOff={isVideoOff}
            isScreenSharing={isScreenSharing}
            isSpeakerOn={isSpeakerOn}
            onToggleMute={handleToggleMute}
            onToggleVideo={handleToggleVideo}
            onToggleScreenShare={handleToggleScreenShare}
            onToggleSpeaker={() => setIsSpeakerOn(!isSpeakerOn)}
            onEndCall={handleEndConference}
          />

          {/* 会议信息 */}
          {!isFullscreen && conferenceState && (
            <Card>
              <CardContent className="p-4">
                <ConferenceInfo
                  conference={conferenceState}
                  duration={conferenceDuration}
                />
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* 使用说明 */}
      {!isInConference && (
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Settings className="h-4 w-4 text-gray-500" />
              <h4 className="font-semibold text-sm">使用说明</h4>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <p>• 视频会议：与选中车辆进行实时视频通话</p>
              <p>• 最多支持4人同时参与视频会议</p>
              <p>• 支持屏幕共享和静音控制</p>
              <p>• 建议在良好的网络环境下使用</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
