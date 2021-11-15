# **AI**nimal :tiger: Zookeeper

**PLEASE SEE KEYPRINCIPLES2**

**THIS IS AN IDEA-IN-PROGRESS.**

A client and server to facilitate observing, interacting with, and managing AI systems in the wild.

As heterogeneous, distributed, and exoitc AI systems (**AI**nimals :tiger:) continue to pervade the real world, it is incrinsingly important to observe, care for, and stay in touch with them. **AI**nimal :tiger: Zookeeper provides a client and server to facilitate this interaction with the following features:

- a cross-platform (iOS, Android, web, desktop) react-native/flutter client which allows users to:

- launch, pause, and terminate model instances; save and restore from checkpoints

- change running state of launched models (training, inference, both, none) 

- view saved model architecture, parameters, and attributes

- observe, override, record, and replaying input modalities, output modalities, activations, and weights

- federate user access to the above features

## Key Principles (idea 2)

- Instead of using a config file, custom API routes, and middleware, the entire server is defined in high-level nodejs objects and functions.

- The server instance is exposed to the client via a graphQL API for direct query (alothough most variables are hidden from unauthorized users).

- Checkpoints are tags in the git graph for a given model. Only some vc providers allow you to view ALL repositories unqualified. Most vc providers let you view by account or by search. 

- The client presents a minimally complex UI to interface with the server.

- To get the server running for a new use-case, all you have to do is change the server code and put your secrets in the .env.local file.

- The server manages running models but they have to be in python and the act, train, input_spec/modality, and output_spec/modality must be defined. The server tries to infer these from the model code, but you can be maximally explicit by subclassing the `AInimal` class.

- If you want the client to enter parameters when launching a model, include a static `list[dict[str,any]]` named `AINIMAL_PARAMETERS` in the model class. It should look something like:

```python
class MyModel(AInimal):
  AINIMAL_PARAMETERS = [
    {
      "name": "learning_rate",
      "type": "float",
      "default": 0.001,
      "description": "The learning rate for the optimizer."
    },
    {
      "name": "batch_size",
      "type": "int",
      "default": 32,
      "description": "The batch size for the model."
    }
  ]

  def __init__(self, learning_rate, batch_size):
    ...
  
  def forward(self, inputs: dict) -> dict:
    ...

  def train(self, traj: list[timestep]) -> 'b':
    ...

  def save(self, path: str) -> None:
    ...

  def load(self, path: str) -> None:
    ...

  @property
  def input_modalities(self) -> dict:
    ...

  @property
  def output_modalities(self) -> dict:
    ...

  @property
  def state(self) -> dict:
    ...
```

Environments are defined in a similar way. (TODO make AInimal.Env) (TODO change AInimal to AInimal.Agent)

Example:
```javascript
// server/main.js
server = Server({
  port: 3000,
  authentication_providers: [
    BasicAuthenticationProvider({
      database: Database | path_to_json_file,
      secret: process.env.JWT_SECRET,
    }),
    GoogleAuthenticationProvider({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    }),
    ...
  ],
  authorization_provider: 
    ...  // determines who can see, edit, delete, etc. what
  ,
  model_providers: [
    LocalModelProvider({
      root: path_to_models,
    }),
    GithubModelProvider({
      token: process.env.GITHUB_TOKEN,
    }),
    ...
  ],
  environments: [
    PythonEnvironment({
      path: path_to_python_env,
      max_instances: 10,
      class_name: "MyModel",
      step_function: "step",  // you don't have to specify this for an ainimal class. Also the server has good inference for gym.Env, dm_env.Env and a few other standard environment types.
    }),
  ],
  compute_providers: [
    LocalComputeProvider({...}),
    ...  // GCP AWS etc. where python launchpad can deploy nodes
  ],
});

server.listen(process.env.PORT || 3000);
```

## Key Principles

- Operators edit the AInimal Server's config file to define what models, model repositories, checkpoints, environments, auth schemes, and compute infrastructure will be used by the server.

- Users use an AInimal Client to connect to an AInimal Server. Then they can observe, interact with, and manage AI systems managed by that server.

- The AInimal Server exposes a graphQL API to allow developers to query and mutate the server's state.

## Customizable use-cases

The config file can be in json or yaml format. I have mixed alternate allowable values in the examples below:

```yaml
server:
  host: localhost
  port: 8000
  https: false


max_envs: 1  # max number of environments to run concurrently
envs:

  - name: Env Name
    path: /path/to/env.py
    type: gym.Env | dm_env.Env
    env_name: 'EnvName'
    max_connected: 1  # only one agent connected at a time (default)
    max_instances: -1  # no limit, default
    create_params:
      - name: user_value1
        display: Maximum speed of agents
        type: str
        default: default_value
    init_params:
      user_param: "${params.user_value1}"
      gcloud_api_key: "${env.gcloud_api_key}"
      gcloud_project: "${env.gcloud_project}"

  - name: EnvName
    path: /path/to/env.py
    type: python_class
    class_name: EnvName
    max_instances: -1,  # no limit, default
    create_params:
      - name: user_value1
        display: Maximum speed of agents
        type: str
        default: default_value
    init_params:
      user_param: "${params.user_value1}"
      gcloud_api_key: "${env.gcloud_api_key}"
      gcloud_project: "${env.gcloud_project}"

  - name: Limboid
    type: pyros
    max_instances: 1,
    autostart: true,  # automatically init the Limboid environment
    init_params:
      port: 12345  # ROS communication port


max_models: 10  # max number of models that can be launched

# you can specify individual models or a model repository
models: 

  - name: ModelName
    type: .tflite | .onnx | .h5 | .keras | .pytorch | .tensorflow | TODO 
    path: /path/to/model.h5

  - name: ModelName
    type: python_class | AInimal | tfagents.Agent | acme.Agent | ptl.Module | TODO
    path: /path/to/model.py
    class_name: ModelName
    act_func: act  # default
    train_func: train  # default
    input_modalities_func: input_modalities | obs_spec  # None default
    output_modalities_func: output_modalities | act_spec  # None default
    save_func: save  # None default
    load_func: load  # None default
    create_params:
      - name: depth
        display: Number of hidden layers
        type: int
        range: [1, 10]
        default: 5
    init_params: 
      depth: "${params.depth}"


model_hubs:  # model hubs to not necesarily support writing

  # if you just have a fixed set of models, package them in a model's 
  # directory and specify the path to the directory under `local_filesystem`
  - type: local_filesystem
    root: /path/to/models
  - type: gcloud_bucket | aws_s3
    bucket: bucket-name
  - type: huggingface
    view_qualifier:  # optional qualifier to only display a subset of all models. Leave blank to display all models.
      domain: limboid
      owner: MyName
    account: username  # password stored in .env.local
  - type: github | tfhub | pytorch_hub
    account: username
    password: ${process.ENV.GITHUB_PASSWORD}
    
# checkpoints are stored wherever the model is saved


no_auth: false  # if true, no authentication is required
authentication_providers:
  - type: jwt
    public_can_create_account: false  # if true, unauthenticated users can create accounts
    admin_can_create_account: false  # if true, admin can create accounts

    # you can use a json file OR a database to store users and hashes
    # pick one OR the other, NOT BOTH
    db_path: /path/to/jwt.db 
    db_address: sqlite:///path/to/jwt.db

    jwt_secret: ${process.ENV.JWT_SECRET}
    jwt_algorithm: HS256
    jwt_issuer: ${process.ENV.JWT_ISSUER}
    jwt_audience: ${process.ENV.JWT_AUDIENCE}
    jwt_expires_in: ${process.ENV.JWT_EXPIRES_IN}
    jwt_not_before: ${process.ENV.JWT_NOT_BEFORE}
    jwt_subject: ${process.ENV.JWT_SUBJECT}
    jwt_jti: ${process.ENV.JWT_JTI}

  - type: google | microsoft | amazon | github | gitlab | bitbucket | TODO
    key: ${process.ENV.GOOGLE_API_KEY}
    secret: ${process.ENV.GOOGLE_API_SECRET}


authorization_provider:
  type: json_file
  path: /path/to/auth.json
  # you can use a json file OR a database
  # pick one OR the other, NOT BOTH


launch_etc:  # other processes to launch when the server starts
  - cmd: jupyter lab --ip '*' --port 8081 --no-browser --allow-root --NotebookApp.token=''
  - cmd: python3 -m http.server 8082
  - cmd: python3 limboid_ros.py --port $ROS_PORT
```


## Minimum complexity interface

The client provides a user-friendly interface to the AI models and environments running on the server.
- If the server does not offer the client the ability to create environments or launch models, the corresponding user interface automatically simplifies. 
- This might be because of permissions rather than ability. Operators might be presented with a more complex user interface than regular users. Obviously, unauthenticated users viewing publicly-obervable computatra will not be presented with joystick controllers, keyboards, etc.
- This might be because the model is a pure python class (causing local variables and operations to be hidden). Only Agent model types can be trained. Most agents types do not provide much modality information so the UI cannot make joystick, keyboard, etc assumptions.

The `AInimal` class should conform to the `ainimal_zookeeper.AInimal` interface:
```python
# AInimal interface
# ainimal_zookeeper/AInimal

class AInimal:

  def __init__(self, save_path: str):
    # initialize the AInimal
    # save_path: path to the directory where the AInimal was saved
    raise NotImplementedError()

  def forward(self, inputs: dict) -> dict:
    # forward inputs through the AInimal
    # inputs: (dict[str, pytree[Tensor]]) of input modalities
    # returns: (dict[str, pytree[Tensor]]) of output modalities
    raise NotImplementedError()

  def train(self, traj: list[timestep]) -> 'b':
    # train the AInimal on a trajectory
    # traj: list of timesteps (dm_env.Timestep TODO get actual name)
    # returns: loss for each batch element in traj after training
    raise NotImplementedError()

  def save(self, path: str) -> None:
    # saves the model and any other necessary files to 
    # a directory at `path`. AInimal Zookeeper will create
    # and zip the directory.
    # path: path to save the AInimal to
    raise NotImplementedError()

  def load(self, path: str) -> None:
    # load a checkpoint into this model instance from `path`
    raise NotImplementedError()

  @property
  def input_modalities(self) -> dict:
    # returns a dictionary of input modalities
    # returns: (dict[str, Modality])
    raise NotImplementedError()

  @property
  def output_modalities(self) -> dict:
    # returns a dictionary of output modalities
    # returns: (dict[str, Modality])
    raise NotImplementedError()

  @property
  def state(self) -> dict:
    # returns: dict of AInimal state: I.E.: Anything you want zookeeper to 
    # be able to inspect, record, and possibly control (e.g.: most recent inputs
    # and outputs, optimizer ema's, hidden layer activations, recurrent state, weights, etc.)
    raise NotImplementedError()
```


## Client

The client provides a cross platform interface for interacting with one or more Zookeeper servers. You can access the client in several ways:

- Launch the server with the flag `--client` and then navigate to the url that is printed in your local browser or on another device in the same LAN. (This method automatically passes server connection information to the client, so it's faster for local development.)

- From the command line, enter: `python3 -m ainimal_zookeeper.client`. Then navigate to the url that is printed in your local browser or on another device in the same LAN.

- Install `Animal Zookeeper` from the .apk, .ipa, .exe, or .appimage files located under `client/*`. In the future, you will also be able to download the mobile apps directly from the App Store or Play Store.

- (Coming soon:) Visit `https://computatrum.io/ainimal_zookeeper` in your browser.

Next connect to a running AInimal Zookeeper server by entering the `server_url` and `server_port`. You may be prompted for a username and password.


## Server

The server can run as a collection of cloud services or as a standalone server.

### Getting Started: GCP

The entire Zookeeper server is composed as a
- storage bucket: for storing recordings and AInimal pickles
- cloud function and API endpoint: for receiving and processing frontend http requests
- kubernetes deployment cluster: for running the AInimal processes

1. For deployment, edit the `server/.env` config file to enable authentication and set limits.

2. Use the gcloud client to deploy the server,
```bash
TODO
```

### Getting Started: Local

The local deployment server is sturctured similarly to the GCP deployment server.
- storage directory: for storing recordings and AInimal pickles
- local server: for receiving and processing frontend http requests
- docker deamon: for running the AInimal processes in docker containers

To deploy locally,
1. Install dependencies:
- docker
- python dependencies:

```bash
cd server
pip install .
```

2. Add AInimal pickles to the `server/ainimals` directory.

3. Run the server:
```bash
cd server
python3 -m ainimal_zookeeper.server  # call with --help for options
```

4. For deployment, edit the `server/.env` config file to enable authentication and set limits.
