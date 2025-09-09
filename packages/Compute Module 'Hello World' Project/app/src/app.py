import os
import json
import time
import requests

with open(os.environ['BUILD2_TOKEN']) as f:
    bearer_token = f.read()

with open(os.environ['RESOURCE_ALIAS_MAP']) as f:
    resource_alias_map = json.load(f)

input_info = resource_alias_map['identifier you put in the config']
output_info = resource_alias_map['identifier you put in the config']

input_rid = input_info['rid']
input_branch = input_info['branch'] or "master"
output_rid = output_info['rid']
output_branch = output_info['branch'] or "master"

FOUNDRY_URL = "TODO"

def get_stream_latest_records():
    url = f"https://{FOUNDRY_URL}/stream-proxy/api/streams/{input_rid}/branches/{input_branch}/records"
    response = requests.get(url, headers={"Authorization": f"Bearer {bearer_token}"})
    return response.json()

def process_record(record):
    # Assume input stream has schema 'x': Integer
    x = record['value']['x']
    # Assume output stream has schema 'twice_x': Integer
    return {'twice_x': x * 2}

def put_record_to_stream(record):
    url = f"https://{FOUNDRY_URL}/stream-proxy/api/streams/{output_rid}/branches/{output_branch}/jsonRecord"
    requests.post(url, json=record, headers={"Authorization": f"Bearer {bearer_token}"})

while True:
    records = get_stream_latest_records()
    processed_records = list(map(process_record, records['records']))
    [put_record_to_stream(record) for record in processed_records]
    time.sleep(60)