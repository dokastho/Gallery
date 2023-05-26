"""
Personal website app_rename_me python package configuration.
"""

from setuptools import setup

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name='app_rename_me',
    version='0.1.0',
    packages=['app_rename_me'],
    author="Thomas Dokas",
    author_email="dokastho@umich.edu",
    url="https://github.com/dokastho/app_rename_me",
    description="A fresh take on what a app_rename_me can do",
    long_description=long_description,
    long_description_content_type="text/markdown",
    include_package_data=True,
    install_requires=[
        'arrow',
        'bs4',
        'Flask',
        'html5validator',
        'pycodestyle',
        'pydocstyle',
        'pylint',
        'pytest',
        'requests',
        'selenium',
    ],
    python_requires='>=3.6',
)
