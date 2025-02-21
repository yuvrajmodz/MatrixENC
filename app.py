from flask import Flask, request, render_template, abort
import urllib.parse
import base64
import base58

app = Flask(__name__)


#  
#  𝗖𝗼𝗽𝘆𝗿𝗶𝗴𝗵𝘁 © 𝟮𝟬𝟮𝟱 𝗬𝗨𝗩𝗥𝗔𝗝𝗠𝗢𝗗𝗭     
#  𝗖𝗥𝗘𝗗𝗜𝗧: 𝐌𝐀𝐓𝐑𝐈𝐗 𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑      
#                                    
      

def is_request_from_home():
    referer = request.headers.get("Referer", "")
    return referer and request.host in referer

@app.route('/')
def home():
    return render_template('matrix-enc.html')

@app.route('/encode')
def encode():
    if not is_request_from_home():
        return "Method Not Allowed", 405
    
    method = request.args.get('method')
    text = request.args.get('text', '')
    
    if not method or not text:
        return "Missing Parameter", 400
    
    try:
        if method == "urlencode":
            encoded_text = urllib.parse.quote(text)
        elif method == "base16":
            encoded_text = base64.b16encode(text.encode()).decode()
        elif method == "base32":
            encoded_text = base64.b32encode(text.encode()).decode()
        elif method == "base58":
            encoded_text = base58.b58encode(text.encode()).decode()
        elif method == "base64":
            encoded_text = base64.b64encode(text.encode()).decode()
        elif method == "base85":
            encoded_text = base64.b85encode(text.encode()).decode()
        else:
            return "Invalid encoding method", 400

        return encoded_text, 200, {"Content-Type": "text/plain"}
    except Exception as e:
        return f"Error: {str(e)}", 500

@app.route('/decode')
def decode():
    if not is_request_from_home():
        return "Method Not Allowed", 405
    
    method = request.args.get('method')
    encoded_text = request.args.get('text', '')
    
    if not method or not encoded_text:
        return "Missing Parameter", 400
    
    try:
        if method == "urlencode":
            decoded_text = urllib.parse.unquote(encoded_text)
        elif method == "base16":
            decoded_text = base64.b16decode(encoded_text).decode()
        elif method == "base32":
            decoded_text = base64.b32decode(encoded_text).decode()
        elif method == "base58":
            decoded_text = base58.b58decode(encoded_text).decode()
        elif method == "base64":
            decoded_text = base64.b64decode(encoded_text).decode()
        elif method == "base85":
            decoded_text = base64.b85decode(encoded_text).decode()
        else:
            return "Invalid decoding method", 400

        return decoded_text, 200, {"Content-Type": "text/plain"}
    except Exception as e:
        return f"Error: {str(e)}", 500

if __name__ == '__main__':
    app.run(debug=True)
