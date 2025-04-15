import gradio as gr
import hmac
import hashlib
import time
import os
import requests
from io import BytesIO
from PIL import Image
import uuid

example_path = os.path.join(os.path.dirname(__file__), 'assets')
clothing_list = os.listdir(os.path.join(example_path, "clothing"))
clothing_list_path = [os.path.join(example_path, "clothing", clothing) for clothing in clothing_list]
human_list = os.listdir(os.path.join(example_path, "human"))
human_list_path = [os.path.join(example_path, "human", human) for human in human_list]

base_url = os.getenv('base_url')
upload_image_url = os.getenv('upload_image_url')
upload_background_image_url = os.getenv('upload_background_image_url')
create_save_task_url = os.getenv('create_save_task_url')
execute_task_url = os.getenv('execute_task_url')
query_task_url = os.getenv('query_task_url')
secret_key = os.getenv('secret_key')
agent_version = os.getenv('agent_version')
agent_name = os.getenv('agent_name')


def parse_response(response):
    data = {}
    msg = ''
    if response.status_code == 200:
        try:
            datas = response.json()
            if datas:
                data = datas.get("data")
                if not data:
                    msg = datas.get("msg")
                    if not msg:
                        msg = "Field error."
            else:
                msg = "The parsing result is empty."
        except Exception as e:
            msg = f"parse error: {repr(e)}."
    else:
        msg = f'request error.'
    return data, msg


def generate_signature(key, did, timestamp):
    data = f"{did}:{timestamp}"
    h = hmac.new(key.encode(), data.encode(), hashlib.sha256)
    return h.hexdigest()


def url_to_image(url, ip):
    headers = {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        'X-Forwarded-For': ip
    }
    try:
        response = requests.get(url, headers=headers, timeout=30)
    except:
        return None
    if response.status_code == 200:
        img = Image.open(BytesIO(response.content))
        return img
    return None


def start_task(task_id, timestamp, signature, did, ip):
    headers = {
        'Did': did,
        'X-Timestamp': timestamp,
        'X-Signature': signature,
        'X-Forwarded-For': ip
    }
    data = {
        "agentVersion": agent_version,
        "agentName": agent_name,
        "taskId": task_id,
        "runFreeAsFallback": False
    }
    response = requests.post(base_url + execute_task_url, json=data, headers=headers)
    data, msg = parse_response(response)
    return data, msg


def create_task(image_url, timestamp, signature, did, ip):
    headers = {
        'Did': did,
        'X-Timestamp': timestamp,
        'X-Signature': signature,
        'X-Forwarded-For': ip
    }
    data = {
        "agentVersion": agent_version,
        "agentName": agent_name,
        "image": image_url
    }
    response = requests.post(base_url + create_save_task_url, json=data, headers=headers)
    data, msg = parse_response(response)
    return data, msg


def save_task(image_url, timestamp, signature, show_image, task_id, location_id, did, ip):
    headers = {
        'Did': did,
        'X-Timestamp': timestamp,
        'X-Signature': signature,
        'X-Forwarded-For': ip
    }
    data = {
        "agentVersion": agent_version,
        "agentName": agent_name,
        "image": image_url,
        "showImage": show_image,
        "taskId": task_id,
        "locationId": location_id,
    }
    response = requests.post(base_url + create_save_task_url, json=data, headers=headers)
    data, msg = parse_response(response)
    return data, msg


def query_task(task_id, execution_id, timestamp, signature, did, ip):
    headers = {
        'Did': did,
        'X-Timestamp': timestamp,
        'X-Signature': signature,
        'X-Forwarded-For': ip
    }
    data = {
        "agentVersion": agent_version,
        "agentName": agent_name,
        "taskId": task_id,
        "executionId": execution_id,
    }
    response = requests.post(base_url + query_task_url, json=data, headers=headers)
    data, msg = parse_response(response)
    return data, msg


def upload_image(image, signature, timestamp, upload_type, did, ip):
    if image is None:
        return None
    if upload_type == 'image':
        upload_url = upload_image_url
    else:
        upload_url = upload_background_image_url
    image_format = image.format if image.format else "PNG"
    mime_type = f"image/{image_format.lower()}"
    with BytesIO() as m_img:
        image.save(m_img, format=image_format)
        m_img.seek(0)
        files = {'image': (f"main_image.{image_format.lower()}", m_img, mime_type)}
        headers = {
            'Did': did,
            'X-Timestamp': timestamp,
            'X-Signature': signature,
            'X-Forwarded-For': ip
        }
        response = requests.post(base_url + upload_url, files=files, headers=headers)
        data, msg = parse_response(response)
        return data, msg


def load_description(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    return content


def generate_image(main_image, background_image, did, request: gr.Request):
    if not did:
        did = str(uuid.uuid4())
    if main_image is None or background_image is None:
        m = "Please upload both the main image and the background reference image before generating."
        return gr.Warning(m), did

    client_ip = request.client.host
    x_forwarded_for = request.headers.get('x-forwarded-for')
    if x_forwarded_for:
        client_ip = x_forwarded_for

    timestamp = str(int(time.time()))
    signature = generate_signature(
        key=secret_key,
        did=did,
        timestamp=timestamp
    )
    upload_image_data, upload_image_msg = upload_image(
        image=main_image,
        signature=signature,
        timestamp=timestamp,
        upload_type='image',
        did=did,
        ip=client_ip
    )
    if not upload_image_data:
        return gr.Warning(upload_image_msg), did
    image_url = upload_image_data.get("image")
    if not image_url:
        m = 'Upload image failed.'
        return gr.Warning(m), did
    create_task_data, create_task_msg = create_task(
        image_url=image_url,
        timestamp=timestamp,
        signature=signature,
        did=did,
        ip=client_ip
    )
    if not create_task_data:
        return gr.Warning(create_task_msg), did
    task_id = create_task_data.get("taskId")
    show_image = create_task_data.get("showImage")
    if not task_id or not show_image:
        m = 'Create task failed.'
        return gr.Warning(m), did
    upload_image_data, upload_image_msg = upload_image(
        image=background_image,
        signature=signature,
        timestamp=timestamp,
        upload_type='background_image',
        did=did,
        ip=client_ip
    )
    if not upload_image_data:
        return gr.Warning(upload_image_msg), did

    save_task_data, save_task_msg = save_task(
        image_url=image_url,
        timestamp=timestamp,
        signature=signature,
        show_image=show_image,
        task_id=task_id,
        location_id=upload_image_data,
        did=did,
        ip=client_ip
    )
    if not save_task_data:
        return gr.Warning(save_task_msg), did
    save_task_id = save_task_data.get("taskId")
    save_show_image = save_task_data.get("showImage")
    if not save_task_id or not save_show_image:
        return gr.Warning('Save task failed'), did
    start_task_data, start_task_msg = start_task(
        task_id=save_task_id,
        timestamp=timestamp,
        signature=signature,
        did=did,
        ip=client_ip
    )
    if not start_task_data:
        return gr.Warning(start_task_msg), did
    execution_id = start_task_data.get("executionId")
    if not execution_id:
        m = "The task failed to start."
        return gr.Warning(m), did
    start_time = int(time.time())
    while True:
        m = "Query task failed."
        query_task_data, query_task_msg = query_task(
            task_id=save_task_id,
            execution_id=execution_id,
            timestamp=timestamp,
            signature=signature,
            did=did,
            ip=client_ip
        )
        if not query_task_data:
            return gr.Warning(query_task_msg), did
        executions = query_task_data.get("executions")
        if not executions:
            return gr.Warning(m), did
        results = executions[0].get("result")
        if not results:
            return gr.Warning(m), did
        status = results[0].get("status")
        if status == "Failed":
            return gr.Warning(m), did
        elif status == "Success" or status == "Blocked":
            img = results[0].get("image")
            if img and str(img).strip() != "":
                return url_to_image(img, ip=client_ip), did
        end_time = int(time.time())
        if end_time - start_time > 3600:
            m = 'Query task timeout.'
            return gr.Warning(m), did
        time.sleep(2)


def preprocess_image(main_image):
    return main_image


def preprocess_background_image(background_image):
    return background_image


css = """  
    .image-container img {  
        max-height: 500px;  
        width: auto;  
    }  
    .hide-buttons .source-selection {  
        display: none;  
    }  
    #example-images .gallery {
        display: flex;  
        flex-wrap: wrap;  
    }
    #example-images .gallery-item .container{
        width: 100%;
        max-width: 100%;
    }
    #example-images .gallery-item {
        flex: 0 0 30%; 
        max-width: 30%; 
        box-sizing: border-box; 
        display: flex;  
        text-align: center;
        justify-content: center;

    }
    @media (max-width: 767px) {
        #example-res-images th {
            font-size: 12px;
            word-wrap: break-word; 
            word-break: break-word;
            white-space: normal; 
            overflow-wrap: break-word; 
        }
    }
"""

with gr.Blocks(css=css) as WeShop:
    current_did = gr.State(value='')
    gr.HTML(load_description("assets/title.html"))
    with gr.Row():
        with gr.Column():
            gr.Markdown("#### Step 1: Upload a garment image")
            main_image_input = gr.Image(
                type="pil",
                label="Main Image",
                elem_classes=["image-container", "hide-buttons"]
            )
            clothing_example = gr.Examples(
                inputs=main_image_input,
                examples_per_page=12,
                examples=clothing_list_path,
                elem_id="example-images",
                outputs=main_image_input
            )

        with gr.Column():
            gr.Markdown("#### Step 2: Upload a person image")
            background_image_input = gr.Image(
                type="pil",
                label="Background reference image",
                elem_classes=["image-container", "hide-buttons"]
            )
            human_example = gr.Examples(
                inputs=background_image_input,
                examples_per_page=12,
                examples=human_list_path,
                elem_id="example-images",
                outputs=background_image_input
            )
        with gr.Column():
            with gr.Row():
                with gr.Column():
                    gr.Markdown("#### Step 3: Press 'Generate' to get the result")
                    output = gr.Image(
                        label="Result",
                        elem_classes=["image-container", "hide-buttons"],
                        interactive=False
                    )
            with gr.Row():
                submit_button = gr.Button("Generate")
                submit_button.click(
                    fn=generate_image,
                    inputs=[main_image_input, background_image_input, current_did],
                    outputs=[output, current_did],
                    concurrency_limit=None
                )
            with gr.Column():
                show_case = gr.Examples(
                    examples=[
                        ["assets/examples/result_02_01.png", "assets/examples/result_02_02.png",
                         "assets/examples/result_02_03.png"],
                        ["assets/examples/result_03_01.png", "assets/examples/result_03_02.png",
                         "assets/examples/result_03_03.png"],
                        ["assets/examples/result_04_01.png", "assets/examples/result_04_02.png",
                         "assets/examples/result_04_03.png"],
                        ["assets/examples/result_05_01.png", "assets/examples/result_05_02.png",
                         "assets/examples/result_05_03.png"],
                        ["assets/examples/result_06_01.png", "assets/examples/result_06_02.png",
                         "assets/examples/result_06_03.png"],
                    ],
                    inputs=[main_image_input, background_image_input, output],
                    elem_id="example-res-images",
                )
    main_image_input.upload(
        fn=preprocess_image,
        inputs=[main_image_input],
        outputs=main_image_input
    )
    background_image_input.upload(
        fn=preprocess_background_image,
        inputs=[background_image_input],
        outputs=background_image_input
    )
WeShop.queue(api_open=False).launch(show_api=False)
