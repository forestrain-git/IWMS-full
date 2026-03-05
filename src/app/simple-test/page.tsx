/**
 * 完全独立的测试页面
 */

export default function SimpleTest() {
  return (
    <div style={{
      backgroundColor: '#f0f0f0',
      color: 'black',
      padding: '40px',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>✅ Simple Test Page</h1>
      <p>如果看到这个页面，说明Next.js服务器工作正常</p>
      <p>问题可能在 /alerts 页面的布局或样式</p>

      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        marginTop: '20px',
        borderRadius: '8px',
        border: '1px solid #ccc'
      }}>
        <h2>测试数据</h2>
        <p>这是一段测试文本</p>
        <button style={{
          backgroundColor: 'blue',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>测试按钮</button>
      </div>
    </div>
  );
}
