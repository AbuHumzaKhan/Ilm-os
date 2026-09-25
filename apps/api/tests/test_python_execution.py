from unittest.mock import patch

from app.application.python_execution import execute_python


def test_python_execution_invokes_isolated_container() -> None:
    completed = type("Completed", (), {"returncode": 0, "stdout": "hello\n", "stderr": ""})()

    with patch("app.application.python_execution.subprocess.run", return_value=completed) as run:
        result = execute_python(
            'print("hello")',
            ["A"],
            [[1]],
        )

    assert result["status"] == "success"
    assert result["stdout"] == "hello\n"
    command = run.call_args.args[0]
    assert command[0] == "docker"
    assert "--network=none" in command
    assert "--read-only" in command
    assert "--cap-drop=ALL" in command


def test_python_execution_rejects_mismatched_dataset() -> None:
    try:
        execute_python("print('x')", ["A", "B"], [[1]])
    except RuntimeError as exc:
        assert "do not match" in str(exc)
    else:
        raise AssertionError("Expected dataset validation failure")
